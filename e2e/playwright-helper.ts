import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, type Locator, type Page, type Request } from "@playwright/test";
import { currentPage, recordCoverageChunk } from "./utils/fixtures";

const DATA_ATTRIBUTE = "data-wd-key";
const FIXTURES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures");
const isMac = process.platform === "darwin";

export function testIdSelector(testId: string): string {
  return `[${DATA_ATTRIBUTE}="${testId}"]`;
}

export function readFixture(name: string): any {
  const contents = fs.readFileSync(path.join(FIXTURES_DIR, name), "utf-8");
  return JSON.parse(contents);
}

/** Retries `assertion` until it stops throwing */
export async function retry(
  assertion: () => Promise<void> | void,
  timeout = 10000,
  interval = 100
): Promise<void> {
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
 * Query re-read the value until they pass.
 */
export class Query<T> {
  readonly __query = true as const;
  constructor(private readonly getter: () => Promise<T>) {}

  get(): Promise<T> {
    return this.getter();
  }

  then<U>(mapper: (value: T) => U | Promise<U>): Query<U> {
    return new Query<U>(async () => mapper(await this.getter()));
  }
}

function isQuery(target: unknown): target is Query<unknown> {
  return typeof target === "object" && target !== null && (target as Query<unknown>).__query === true;
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
export function assertDeepNestedInclude(actual: any, expected: Record<string, unknown>): void {
  for (const key of Object.keys(expected)) {
    expect(actual?.[key], `property "${key}"`).toEqual(expected[key]);
  }
}

/**
 * Fluent, auto-retrying assertions over a Playwright Locator or a lazily
 * evaluated value/Query. This is the generic base that the maputnik-specific
 * assertable extends.
 */
export class Assertable<T> {
  constructor(protected readonly target: T, protected readonly page?: Page) {}

  private locator(): Locator {
    if (!isLocator(this.target)) throw new Error("Expected a Locator target for this assertion");
    return this.target;
  }

  protected async assertValue(assertion: (value: any) => void): Promise<void> {
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
}

export async function typeSequence(page: Page, text: string): Promise<void> {
  const tokens = text.match(/\{[^}]+\}|[^{]+/g) ?? [];
  const modifierMap: Record<string, string> = { meta: "Meta", ctrl: "Control", shift: "Shift", alt: "Alt" };
  const namedKeys: Record<string, string> = {
    esc: "Escape",
    enter: "Enter",
    backspace: "Backspace",
    del: "Delete",
    tab: "Tab",
    home: "Home",
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

/**
 * This is where all plywright-specific test helpers live.
 * It is used by the MaputnikDriver to implement the Maputnik-specific test helpers.
 */
export class PlaywrightHelper {
  private readonly recordedRequests = new Map<string, Request[]>();

  private get page(): Page {
    return currentPage();
  }

  private testId(testId: string): Locator {
    return this.page.locator(testIdSelector(testId));
  }

  public given = {
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
  };

  public when = {
    visit: async (url: string) => {
      // Snapshot coverage before navigating, since a full page load resets it.
      await recordCoverageChunk(this.page);
      await this.page.goto(url);
    },

    wait: (ms: number) => this.page.waitForTimeout(ms),

    tab: () => this.page.keyboard.press("Tab"),

    typeKeys: (keys: string) => typeSequence(this.page, keys),

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

    selectWithin: async (parentTestId: string, value: string) => {
      await this.testId(parentTestId).locator("select").selectOption(value);
    },

    clickWithin: async (parentTestId: string, selector: string) => {
      await this.testId(parentTestId).locator(selector).first().click();
    },

    clickByText: async (text: string) => {
      await this.page.getByText(text).click();
    },

    clickByAttribute: async (attribute: string, value: string) => {
      await this.page.locator(`[${attribute}="${value}"]`).click();
    },

    scrollToBottom: async (element: Locator) => {
      await element.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    },

    setValue: async (testId: string, text: string) => {
      const input = this.testId(testId);
      await input.fill("");
      await input.fill(text);
    },

    type: async (testId: string, text: string) => {
      await this.testId(testId).focus();
      // Place the caret at the start of the field, so a leading "{backspace}"
      // is a no-op rather than clearing an already-committed value.
      await this.page.keyboard.press("Home");
      await typeSequence(this.page, text);
    },

    dragAndDropWithWait: async (source: string, target: string) => {
      const from = await centerOf(this.testId(source));
      const to = await centerOf(this.testId(target));
      await this.page.mouse.move(from.x, from.y);
      await this.page.mouse.down();
      await this.page.mouse.move(from.x, from.y + 10);
      await this.page.mouse.move(to.x, to.y, { steps: 10 });
      await this.page.waitForTimeout(100);
      await this.page.mouse.up();
    },

    clickCenter: async (testId: string) => {
      const { x, y } = await centerOf(this.testId(testId));
      await this.page.mouse.move(x, y);
      await this.page.mouse.down();
      await this.page.waitForTimeout(200);
      await this.page.mouse.up();
    },

    openFileByFixture: async (fixture: string, buttonTestId: string, inputTestId: string) => {
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
    },

    dropFileByFixture: async (fixture: string, dropzoneTestId: string) => {
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
    },

    waitForResponse: async (alias: string) => {
      const requests = this.recordedRequests.get(alias);
      if (!requests) throw new Error(`No intercept registered for alias "${alias}"`);
      await retry(async () => {
        if (requests.length === 0) throw new Error(`No request recorded for alias "${alias}"`);
      });
      return requests[requests.length - 1];
    },

    clearLocalStorage: () => this.page.evaluate(() => window.localStorage.clear()),
  };

  public get = {
    element: (selector: string) => this.page.locator(selector),

    elementByTestId: (testId: string) => this.testId(testId),

    inputValue: (testId: string) => new Query<string>(() => this.testId(testId).first().inputValue()),

    elementsText: (testId: string) => new Query<string>(() => this.testId(testId).first().innerText()),

    locationHash: () => new Query<string>(async () => new URL(this.page.url()).hash),
  };
}
