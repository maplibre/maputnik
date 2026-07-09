import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, type Locator, type Page, type Request } from "@playwright/test";
import { currentPage, recordCoverageChunk } from "./utils/fixtures";
import { ModalDriver } from "./modal-driver";

const baseUrl = "http://localhost:8888/";
const FIXTURES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures");
const DATA_ATTRIBUTE = "data-wd-key";

const isMac = process.platform === "darwin";

function testIdSelector(testId: string): string {
  return `[${DATA_ATTRIBUTE}="${testId}"]`;
}

export function readFixture(name: string): any {
  const contents = fs.readFileSync(path.join(FIXTURES_DIR, name), "utf-8");
  return JSON.parse(contents);
}

/** Reads the maputnik style currently persisted in localStorage. */
function styleFromLocalStorage(page: Page): Promise<any> {
  return page.evaluate(() => {
    const styleId = window.localStorage.getItem("maputnik:latest_style");
    const styleItemKey = `maputnik:style:${styleId}`;
    const styleItem = window.localStorage.getItem(styleItemKey);
    if (!styleItem) throw new Error("Could not get styleItem from localStorage");
    return JSON.parse(styleItem);
  });
}

async function retry(assertion: () => Promise<void> | void, timeout = 10000, interval = 100): Promise<void> {
  const start = Date.now();
  let lastError: unknown;
  for (;;) {
    try {
      await assertion();
      return;
    } catch (error) {
      lastError = error;
      if (Date.now() - start > timeout) throw lastError;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
}

/**
 * A lazily-evaluated value (e.g. the style in localStorage). Assertions on a
 * Query re-read the value until they pass, mirroring Cypress' retry-ability.
 */
export class Query<T> {
  readonly __maputnikQuery = true as const;
  constructor(private readonly getter: () => Promise<T>) {}

  get(): Promise<T> {
    return this.getter();
  }

  then<U>(mapper: (value: T) => U | Promise<U>): Query<U> {
    return new Query<U>(async () => mapper(await this.getter()));
  }
}

function isQuery(target: unknown): target is Query<unknown> {
  return typeof target === "object" && target !== null && (target as Query<unknown>).__maputnikQuery === true;
}

function isLocator(target: unknown): target is Locator {
  return (
    typeof target === "object" &&
    target !== null &&
    typeof (target as Locator).count === "function" &&
    typeof (target as Locator).boundingBox === "function"
  );
}

/** Asserts that every top-level key in `expected` deep-equals its counterpart in `actual`. */
function assertDeepNestedInclude(actual: any, expected: Record<string, unknown>): void {
  for (const key of Object.keys(expected)) {
    expect(actual?.[key], `property "${key}"`).toEqual(expected[key]);
  }
}

export class MaputnikAssertable<T> {
  constructor(private readonly target: T, private readonly page?: Page) {}

  private locator(): Locator {
    if (!isLocator(this.target)) throw new Error("Expected a Locator target for this assertion");
    return this.target;
  }

  private async assertValue(assertion: (value: any) => void): Promise<void> {
    const target = this.target;
    if (isQuery(target)) {
      await retry(async () => assertion(await target.get()));
    } else {
      assertion(await (target as any));
    }
  }

  // Element assertions (auto-retrying via Playwright web-first assertions).
  shouldBeVisible = () => expect(this.locator().first()).toBeVisible();
  // Some testids resolve to many elements that are always rendered but hidden
  // (e.g. per-field documentation panels); "not visible" means none is visible.
  shouldNotBeVisible = () => expect(this.locator().filter({ visible: true })).toHaveCount(0);
  shouldExist = async () => {
    if (isLocator(this.target)) {
      await expect(this.locator().first()).toBeAttached();
    } else {
      await this.assertValue((value) => expect(value).toBeTruthy());
    }
  };
  shouldNotExist = () => expect(this.locator()).toHaveCount(0);
  shouldBeFocused = () => expect(this.locator().first()).toBeFocused();
  shouldNotBeFocused = () => expect(this.locator().first()).not.toBeFocused();
  shouldHaveValue = (value: string) => expect(this.locator().first()).toHaveValue(value);
  shouldContainText = async (text: string) => {
    const locator = this.locator();
    // Prefer the visible element when a testid resolves to several (only the
    // open documentation panel is visible; the rest are hidden in the DOM).
    const target = (await locator.count()) > 1 ? locator.filter({ visible: true }).first() : locator.first();
    await expect(target).toContainText(text);
  };
  shouldHaveText = (text: string) => expect(this.locator().first()).toHaveText(text);
  shouldHaveLength = (length: number) => expect(this.locator()).toHaveCount(length);
  shouldHaveCss = (property: string, value: string) => expect(this.locator().first()).toHaveCSS(property, value);

  // Value assertions (auto-retrying for Query targets).
  shouldEqual = (value: any) => this.assertValue((actual) => expect(actual).toBe(value));

  shouldInclude = (value: any) =>
    this.assertValue((actual) => {
      if (typeof value === "object" && value !== null) {
        expect(actual).toMatchObject(value);
      } else {
        expect(String(actual)).toContain(String(value));
      }
    });

  shouldDeepNestedInclude = (value: Record<string, unknown>) =>
    this.assertValue((actual) => assertDeepNestedInclude(actual, value));

  /**
   * Asserts that the object under test (a fixture / response body) contains every
   * top-level property of the style currently stored in localStorage.
   */
  shouldEqualToStoredStyle = async () => {
    if (!this.page) throw new Error("shouldEqualToStoredStyle requires a page-bound assertable");
    const expected = await (this.target as any);
    await retry(async () => {
      const stored = await styleFromLocalStorage(this.page!);
      assertDeepNestedInclude(expected, stored);
    });
  };
}

/**
 * Translates a Cypress-style key sequence (e.g. "{meta}z", "{esc}", "0.") into
 * Playwright keyboard actions on the currently focused element.
 */
async function typeSequence(page: Page, text: string): Promise<void> {
  const tokens = text.match(/\{[^}]+\}|[^{]+/g) ?? [];
  const modifierMap: Record<string, string> = { meta: "Meta", ctrl: "Control", shift: "Shift", alt: "Alt" };
  const namedKeys: Record<string, string> = {
    esc: "Escape",
    enter: "Enter",
    backspace: "Backspace",
    del: "Delete",
    tab: "Tab",
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token.startsWith("{") || !token.endsWith("}")) {
      await page.keyboard.type(token);
      continue;
    }
    const name = token.slice(1, -1).toLowerCase();
    if (name === "selectall") {
      await page.keyboard.press(isMac ? "Meta+a" : "Control+a");
    } else if (namedKeys[name]) {
      await page.keyboard.press(namedKeys[name]);
    } else if (modifierMap[name]) {
      const modifiers = [modifierMap[name]];
      let j = i + 1;
      while (j < tokens.length && /^\{(meta|ctrl|shift|alt)\}$/i.test(tokens[j])) {
        modifiers.push(modifierMap[tokens[j].slice(1, -1).toLowerCase()]);
        j++;
      }
      const key = tokens[j] ?? "";
      await page.keyboard.press([...modifiers, key].join("+"));
      i = j;
    }
  }
}

async function centerOf(locator: Locator): Promise<{ x: number; y: number }> {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Element has no bounding box");
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

export class MaputnikDriver {
  private scope: Locator | null = null;
  private readonly recordedRequests = new Map<string, Request[]>();
  private readonly modalDriver = new ModalDriver(this);

  /**
   * The page for the currently running test. Resolved lazily so a single driver
   * instance can be created once per `describe` and reused across its tests.
   */
  private get page(): Page {
    return currentPage();
  }

  // ---- Element access ------------------------------------------------------

  private root(): Page | Locator {
    return this.scope ?? this.page;
  }

  private testId(testId: string): Locator {
    return this.root().locator(testIdSelector(testId));
  }

  then = <T>(target: T) => new MaputnikAssertable(target, this.page);

  // ---- given ---------------------------------------------------------------

  public given = {
    fixture: (_name: string, _alias?: string) => {
      // Fixtures are read directly from disk in Playwright, no registration needed.
    },

    intercept: async (pattern: RegExp, alias: string, _method = "GET") => {
      this.recordedRequests.set(alias, []);
      await this.page.route(pattern, (route) => {
        this.recordedRequests.get(alias)!.push(route.request());
        route.continue();
      });
    },

    interceptAndMockResponse: async (options: {
      method?: string;
      url: string | RegExp;
      response: unknown | { fixture: string };
      alias?: string;
    }) => {
      const { url, response, alias } = options;
      if (alias) this.recordedRequests.set(alias, []);
      await this.page.route(url, (route) => {
        if (alias) this.recordedRequests.get(alias)!.push(route.request());
        const body =
          response && typeof response === "object" && "fixture" in (response as any)
            ? readFixture((response as { fixture: string }).fixture)
            : response;
        route.fulfill({ json: body });
      });
    },

    setupMockBackedResponses: async () => {
      const styleFixtures = [
        "example-style.json",
        "example-layer-style.json",
        "geojson-style.json",
        "raster-style.json",
        "geojson-raster-style.json",
        "rectangles-style.json",
        "example-style-with-fonts.json",
        "example-style-with-zoom-7-and-center-0-51.json",
        "example-style-with-zoom-5-and-center-50-50.json",
      ];
      for (const fixture of styleFixtures) {
        await this.given.interceptAndMockResponse({
          method: "GET",
          url: baseUrl + fixture,
          response: { fixture },
          alias: fixture === "example-style.json" ? "example-style.json" : undefined,
        });
      }
      await this.given.interceptAndMockResponse({ method: "GET", url: /example\.local\//, response: [] });
      await this.given.interceptAndMockResponse({ method: "GET", url: /example\.com\//, response: [] });
      await this.given.interceptAndMockResponse({
        method: "GET",
        url: "https://www.glyph-server.com/*",
        response: ["Font 1", "Font 2", "Font 3"],
      });
    },
  };

  // ---- when ----------------------------------------------------------------

  public when = {
    modal: this.modalDriver.when,

    visit: async (url: string) => {
      await recordCoverageChunk(this.page);
      const target = url.startsWith("http") ? url : new URL(url, baseUrl).toString();
      await this.page.goto(target);
    },

    wait: (ms: number) => this.page.waitForTimeout(ms),

    tab: () => this.page.keyboard.press("Tab"),

    typeKeys: (keys: string) => typeSequence(this.page, keys),

    doWithin: async (selector: string, fn: () => Promise<void> | void) => {
      const previous = this.scope;
      this.scope = (previous ?? this.page).locator(testIdSelector(selector));
      try {
        await fn();
      } finally {
        this.scope = previous;
      }
    },

    click: async (testId: string, index = 0) => {
      // Documentation buttons are wrapped in a <label>/.maputnik-doc-target that
      // Playwright treats as intercepting the click; bypass the check for them.
      const force = testId.startsWith("field-doc-button-");
      await this.testId(testId).nth(index).click({ force });
    },

    realClick: async (testId: string) => {
      await this.testId(testId).click();
    },

    hover: async (testId: string) => {
      await this.testId(testId).hover();
    },

    focus: async (testId: string) => {
      await this.testId(testId).focus();
    },

    clear: async (testId: string) => {
      await this.testId(testId).clear();
    },

    select: async (testId: string, value: string) => {
      await this.testId(testId).selectOption(value);
    },

    selectWithin: async (selector: string, value: string) => {
      await this.root().locator(testIdSelector(selector)).locator("select").selectOption(value);
    },

    setValue: async (testId: string, text: string) => {
      const input = this.testId(testId);
      await input.fill("");
      await input.fill(text);
    },

    type: async (testId: string, text: string) => {
      await this.testId(testId).focus();
      // Place the caret at the start of the field (matching how the original
      // Cypress suite typed), so a leading "{backspace}" is a no-op rather than
      // clearing an already-committed value.
      await this.page.keyboard.press("Home");
      await typeSequence(this.page, text);
    },

    setValueToPropertyArray: async (selector: string, value: string) => {
      await this.when.doWithin(selector, async () => {
        const input = this.root().locator(".maputnik-array-block-content input").last();
        await input.focus();
        await typeSequence(this.page, "{selectall}" + value);
      });
    },

    addValueToPropertyArray: async (selector: string, value: string) => {
      await this.when.doWithin(selector, async () => {
        await this.root().locator(".maputnik-array-add-value").click();
        const input = this.root().locator(".maputnik-array-block-content input").last();
        await input.focus();
        await typeSequence(this.page, "{selectall}" + value);
      });
    },

    setStyle: async (
      styleProperties:
        | "geojson"
        | "raster"
        | "both"
        | "layer"
        | "rectangles"
        | "font"
        | "zoom_7_center_0_51"
        | "",
      zoom?: number
    ) => {
      const styleFileByKey: Record<string, string> = {
        geojson: "geojson-style.json",
        raster: "raster-style.json",
        both: "geojson-raster-style.json",
        layer: "example-layer-style.json",
        rectangles: "rectangles-style.json",
        font: "example-style-with-fonts.json",
        zoom_7_center_0_51: "example-style-with-zoom-7-and-center-0-51.json",
      };

      const url = new URL(baseUrl);
      if (styleProperties && styleFileByKey[styleProperties]) {
        url.searchParams.set("style", baseUrl + styleFileByKey[styleProperties]);
      }
      if (zoom) {
        url.hash = `${zoom}/41.3805/2.1635`;
      }

      await this.when.visit(url.toString());

      const toolbarLink = this.testId("toolbar:link");
      await toolbarLink.scrollIntoViewIfNeeded();
      await expect(toolbarLink).toBeVisible();
    },

    openASecondStyleWithDifferentZoomAndCenter: async () => {
      await this.page.getByRole("button", { name: "Open" }).click();
      const input = this.testId("modal:open.url.input");
      await expect(input).toBeEnabled();
      await input.fill("http://localhost:8888/example-style-with-zoom-5-and-center-50-50.json");
      await input.press("Enter");
    },

    chooseExampleFile: async () => {
      await this.openFileByFixture("example-style.json", "modal:open.dropzone", "modal:open.file.input");
      await this.when.wait(200);
    },

    dropExampleFile: async () => {
      await this.dropFileByFixture("example-style.json", "modal:open.dropzone");
      await this.when.wait(200);
    },

    clickZoomIn: async () => {
      await this.page.locator(".maplibregl-ctrl-zoom-in").click();
    },

    closePopup: async () => {
      await this.page.locator(".maplibregl-popup-close-button").click();
    },

    clickCenter: async (testId: string) => {
      const { x, y } = await centerOf(this.testId(testId));
      await this.page.mouse.move(x, y);
      await this.page.mouse.down();
      await this.when.wait(200);
      await this.page.mouse.up();
    },

    collapseGroupInLayerEditor: async (index = 0) => {
      await this.page.locator(".maputnik-layer-editor-group__button").nth(index).click();
    },

    appendTextInJsonEditor: async (text: string) => {
      await this.page.locator(".cm-line").first().click();
      // Move to the very start of the document so the inserted text breaks the
      // root JSON structure (CodeMirror auto-closes brackets otherwise).
      await this.page.keyboard.press("Home");
      await typeSequence(this.page, text);
    },

    setTextInJsonEditor: async (text: string) => {
      const firstLine = this.page.locator(".cm-line").first();
      await firstLine.click();
      await this.page.keyboard.press(isMac ? "Meta+a" : "Control+a");
      await this.page.keyboard.type(text);
    },

    dragAndDropWithWait: async (source: string, target: string) => {
      const from = await centerOf(this.testId(source));
      const to = await centerOf(this.testId(target));
      await this.page.mouse.move(from.x, from.y);
      await this.page.mouse.down();
      await this.page.mouse.move(from.x, from.y + 10);
      await this.page.mouse.move(to.x, to.y, { steps: 10 });
      await this.when.wait(100);
      await this.page.mouse.up();
    },

    waitForResponse: async (alias: string) => {
      const requests = this.recordedRequests.get(alias);
      if (!requests) throw new Error(`No intercept registered for alias "${alias}"`);
      await retry(async () => {
        if (requests.length === 0) throw new Error(`No request recorded for alias "${alias}"`);
      });
      return requests[requests.length - 1];
    },

    waitForExampleFileResponse: () => this.when.waitForResponse("example-style.json"),

    clearLocalStorage: () => this.page.evaluate(() => window.localStorage.clear()),
  };

  // ---- get -----------------------------------------------------------------

  public get = {
    isMac: () => isMac,

    element: (selector: string) => this.root().locator(selector),

    elementByTestId: (testId: string) => this.testId(testId),

    elementByText: (text: string) => this.root().getByText(text),

    elementByAttribute: (attribute: string, value: string) =>
      this.root().locator(`[${attribute}="${value}"]`),

    canvas: () => this.page.locator("canvas"),

    searchControl: () => this.page.locator(".maplibregl-ctrl-geocoder"),

    skipTargetLayerList: () => this.testId("skip-target-layer-list"),

    skipTargetLayerEditor: () => this.testId("skip-target-layer-editor"),

    inputValue: (testId: string) => new Query<string>(() => this.testId(testId).first().inputValue()),

    elementsText: (testId: string) => new Query<string>(() => this.testId(testId).first().innerText()),

    locationHash: () => new Query<string>(async () => new URL(this.page.url()).hash),

    styleFromLocalStorage: () => new Query<any>(() => styleFromLocalStorage(this.page)),

    fixture: (name: string) => Promise.resolve(readFixture(name)),

    responseBody: (alias: string) => {
      // Our mocked style responses always return the matching fixture.
      const name = alias.endsWith(".json") ? alias : `${alias}.json`;
      return Promise.resolve(readFixture(name));
    },

    exampleFileUrl: () => baseUrl + "example-style.json",
  };

  // ---- file open helpers ---------------------------------------------------

  private async openFileByFixture(fixture: string, buttonTestId: string, inputTestId: string): Promise<void> {
    const content = JSON.stringify(readFixture(fixture));
    const hasPicker = await this.page.evaluate(() => "showOpenFilePicker" in window);
    if (hasPicker) {
      await this.page.evaluate((fileContent) => {
        (window as any).showOpenFilePicker = async () => [
          { getFile: async () => ({ text: async () => fileContent }) },
        ];
      }, content);
      await this.testId(buttonTestId).click();
    } else {
      await this.testId(inputTestId).setInputFiles({
        name: fixture,
        mimeType: "application/json",
        buffer: Buffer.from(content),
      });
    }
  }

  private async dropFileByFixture(fixture: string, dropzoneTestId: string): Promise<void> {
    const content = JSON.stringify(readFixture(fixture));
    const dataTransfer = await this.page.evaluateHandle((fileContent) => {
      const dt = new DataTransfer();
      dt.items.add(new File([fileContent], "example-style.json", { type: "application/json" }));
      return dt;
    }, content);
    const dropzone = this.testId(dropzoneTestId);
    await dropzone.dispatchEvent("dragenter", { dataTransfer });
    await dropzone.dispatchEvent("dragover", { dataTransfer });
    await dropzone.dispatchEvent("drop", { dataTransfer });
  }
}
