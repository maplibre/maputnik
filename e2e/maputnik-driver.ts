import { expect, type Page } from "@playwright/test";
import { currentPage } from "./utils/fixtures";
import {
  Assertable,
  PlaywrightHelper,
  Query,
  assertDeepNestedInclude,
  readFixture,
  retry,
  typeSequence,
} from "./playwright-helper";
import { ModalDriver } from "./modal-driver";

const baseUrl = "http://localhost:8888/";
const isMac = process.platform === "darwin";

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

export class MaputnikAssertable<T> extends Assertable<T> {
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
 * The maputnik-specific driver. It builds on the generic {@link PlaywrightHelper}
 * — spreading its `given`/`when`/`get` primitives and adding domain concepts
 * (loading a style, the add-layer modal, the JSON editor, …).
 */
export class MaputnikDriver {
  private readonly helper = new PlaywrightHelper();
  private readonly modalDriver = new ModalDriver(this);

  private get page(): Page {
    return currentPage();
  }

  then = <T>(target: T) => new MaputnikAssertable(target, this.page);

  public given = {
    ...this.helper.given,

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
        await this.helper.given.interceptAndMockResponse({
          method: "GET",
          url: baseUrl + fixture,
          response: { fixture },
          alias: fixture === "example-style.json" ? "example-style.json" : undefined,
        });
      }
      await this.helper.given.interceptAndMockResponse({ method: "GET", url: /example\.local\//, response: [] });
      await this.helper.given.interceptAndMockResponse({ method: "GET", url: /example\.com\//, response: [] });
      await this.helper.given.interceptAndMockResponse({
        method: "GET",
        url: "https://www.glyph-server.com/*",
        response: ["Font 1", "Font 2", "Font 3"],
      });
    },
  };

  public when = {
    ...this.helper.when,

    modal: this.modalDriver.when,

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

      await this.helper.when.visit(url.toString());

      const toolbarLink = this.helper.get.elementByTestId("toolbar:link");
      await toolbarLink.scrollIntoViewIfNeeded();
      await expect(toolbarLink).toBeVisible();
    },

    openASecondStyleWithDifferentZoomAndCenter: async () => {
      await this.page.getByRole("button", { name: "Open" }).click();
      const input = this.helper.get.elementByTestId("modal:open.url.input");
      await expect(input).toBeEnabled();
      await input.fill("http://localhost:8888/example-style-with-zoom-5-and-center-50-50.json");
      await input.press("Enter");
    },

    chooseExampleFile: async () => {
      await this.helper.when.openFileByFixture("example-style.json", "modal:open.dropzone", "modal:open.file.input");
      await this.helper.when.wait(200);
    },

    dropExampleFile: async () => {
      await this.helper.when.dropFileByFixture("example-style.json", "modal:open.dropzone");
      await this.helper.when.wait(200);
    },

    clickZoomIn: async () => {
      await this.helper.get.element(".maplibregl-ctrl-zoom-in").click();
    },

    closePopup: async () => {
      await this.helper.get.element(".maplibregl-popup-close-button").click();
    },

    collapseGroupInLayerEditor: async (index = 0) => {
      await this.helper.get.element(".maputnik-layer-editor-group__button").nth(index).click();
    },

    appendTextInJsonEditor: async (text: string) => {
      await this.helper.get.element(".cm-line").first().click();
      // Move to the very start of the document so the inserted text breaks the
      // root JSON structure (CodeMirror auto-closes brackets otherwise).
      await this.page.keyboard.press("Home");
      await typeSequence(this.page, text);
    },

    setTextInJsonEditor: async (text: string) => {
      const firstLine = this.helper.get.element(".cm-line").first();
      await firstLine.click();
      await this.page.keyboard.press(isMac ? "Meta+a" : "Control+a");
      await this.page.keyboard.type(text);
    },

    setValueToPropertyArray: async (selector: string, value: string) => {
      const block = this.helper.get.elementByTestId(selector);
      const input = block.locator(".maputnik-array-block-content input").last();
      await input.focus();
      await typeSequence(this.page, "{selectall}" + value);
    },

    addValueToPropertyArray: async (selector: string, value: string) => {
      const block = this.helper.get.elementByTestId(selector);
      await block.locator(".maputnik-array-add-value").click();
      const input = block.locator(".maputnik-array-block-content input").last();
      await input.focus();
      await typeSequence(this.page, "{selectall}" + value);
    },

    waitForExampleFileResponse: () => this.helper.when.waitForResponse("example-style.json"),

    /** Fill localStorage until we get a QuotaExceededError. */
    fillLocalStorage: async () => {
      await this.page.evaluate(() => {
        let chunkSize = 1000;
        const chunk = new Array(chunkSize).join("x");
        let index = 0;

        // Keep adding until we hit the quota
        for (;;) {
          try {
            const key = `maputnik:fill-${index++}`;
            window.localStorage.setItem(key, chunk);
          } catch (e: any) {
            // Verify it's a quota error
            if (e.name === "QuotaExceededError") {
              if (chunkSize <= 1) return;
              chunkSize /= 2;
              continue;
            }
            throw e; // Unexpected error
          }
        }
      });
    },
  };

  public get = {
    ...this.helper.get,

    isMac: () => isMac,

    canvas: () => this.page.locator("canvas"),

    searchControl: () => this.page.locator(".maplibregl-ctrl-geocoder"),

    skipTargetLayerList: () => this.helper.get.elementByTestId("skip-target-layer-list"),

    skipTargetLayerEditor: () => this.helper.get.elementByTestId("skip-target-layer-editor"),

    styleFromLocalStorage: () => new Query<any>(() => styleFromLocalStorage(this.page)),

    fixture: (name: string) => Promise.resolve(readFixture(name)),

    responseBody: (alias: string) => {
      // Our mocked style responses always return the matching fixture.
      const name = alias.endsWith(".json") ? alias : `${alias}.json`;
      return Promise.resolve(readFixture(name));
    },

    exampleFileUrl: () => baseUrl + "example-style.json",
  };
}
