import { PlaywrightHelper } from "./playwright-helper";
import { ModalDriver } from "./modal-driver";

const baseUrl = "http://localhost:8888/";
const isMac = process.platform === "darwin";

/**
 * The maputnik-specific driver. It builds on the generic {@link PlaywrightHelper}
 * — spreading its `given`/`when`/`get` primitives and adding domain concepts
 * (loading a style, the add-layer modal, the JSON editor, …). All Playwright
 * access goes through the helper; the driver never touches `page` directly.
 */
export class MaputnikDriver {
  private readonly helper = new PlaywrightHelper();
  private readonly modalDriver = new ModalDriver();

  then = this.helper.then;

  /** Reads the maputnik style currently persisted in localStorage. */
  private async readStoredStyle(): Promise<any> {
    const styleId = await this.helper.get.localStorageItem("maputnik:latest_style");
    const styleItem = await this.helper.get.localStorageItem(`maputnik:style:${styleId}`);
    if (!styleItem) throw new Error("Could not get styleItem from localStorage");
    return JSON.parse(styleItem);
  }

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
      await this.then(toolbarLink).shouldBeVisible();
    },

    openASecondStyleWithDifferentZoomAndCenter: async () => {
      await this.helper.when.clickButtonByName("Open");
      const input = this.helper.get.elementByTestId("modal:open.url.input");
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
      await this.helper.when.typeKeys("{home}");
      await this.helper.when.typeText(text);
    },

    setTextInJsonEditor: async (text: string) => {
      await this.helper.get.element(".cm-line").first().click();
      await this.helper.when.typeKeys("{selectall}");
      await this.helper.when.typeText(text);
    },

    setValueToPropertyArray: async (selector: string, value: string) => {
      const input = this.helper.get.elementByTestId(selector).locator(".maputnik-array-block-content input").last();
      await input.focus();
      await this.helper.when.typeKeys("{selectall}");
      await this.helper.when.typeText(value);
    },

    addValueToPropertyArray: async (selector: string, value: string) => {
      const block = this.helper.get.elementByTestId(selector);
      await block.locator(".maputnik-array-add-value").click();
      const input = block.locator(".maputnik-array-block-content input").last();
      await input.focus();
      await this.helper.when.typeKeys("{selectall}");
      await this.helper.when.typeText(value);
    },

    waitForExampleFileResponse: () => this.helper.when.waitForResponse("example-style.json"),

    /** Fill localStorage until we get a QuotaExceededError. */
    fillLocalStorage: () => this.helper.when.fillLocalStorageUntilQuota("maputnik:fill-"),
  };

  public get = {
    ...this.helper.get,

    isMac: () => isMac,

    canvas: () => this.helper.get.element("canvas"),

    searchControl: () => this.helper.get.element(".maplibregl-ctrl-geocoder"),

    skipTargetLayerList: () => this.helper.get.elementByTestId("skip-target-layer-list"),

    skipTargetLayerEditor: () => this.helper.get.elementByTestId("skip-target-layer-editor"),

    styleFromLocalStorage: () => this.helper.query(() => this.readStoredStyle()),

    fixture: (name: string) => this.helper.readFixture(name),

    responseBody: (alias: string) => {
      // Our mocked style responses always return the matching fixture.
      const name = alias.endsWith(".json") ? alias : `${alias}.json`;
      return this.helper.readFixture(name);
    },

    exampleFileUrl: () => baseUrl + "example-style.json",
  };
}
