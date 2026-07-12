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
        "access-token-style.json",
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
        | "access_tokens"
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
        access_tokens: "access-token-style.json",
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

    /** Picks the example style through the browser's native file chooser. */
    chooseExampleFileFromPicker: async () => {
      await this.helper.when.chooseFileFromPicker("example-style.json", "modal:open.dropzone");
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

    /** Expands/collapses a layer-editor group by its title, e.g. "Paint properties". */
    toggleGroupInLayerEditor: async (title: string) => {
      await this.helper.when.click("layer-editor-group:" + title);
    },

    /**
     * Picks a source for the selected layer from the source autocomplete.
     * The autocomplete is a controlled (downshift) input, so the value has to be
     * filled rather than typed key by key, then chosen from the filtered menu.
     */
    changeLayerSource: async (sourceId: string) => {
      const input = this.helper.get.elementByTestId("layer-editor.layer-source").locator("input");
      await input.fill(sourceId);
      await this.helper.get.element(".maputnik-autocomplete-menu-item").first().click();
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

    makeZoomFunction: async (fieldName: string) => {
      const container = this.helper.get.elementByTestId("spec-field-container:" + fieldName);
      await container.scrollIntoViewIfNeeded();
      await container.locator(".maputnik-make-zoom-function").last().click({ force: true });
    },

    makeDataFunction: async (fieldName: string) => {
      const container = this.helper.get.elementByTestId("spec-field-container:" + fieldName);
      await container.scrollIntoViewIfNeeded();
      await container.locator(".maputnik-make-data-function").click({ force: true });
    },

    addFunctionStop: async (fieldName: string) => {
      const container = this.helper.get.elementByTestId("spec-field-container:" + fieldName);
      await container.locator(".maputnik-add-stop").first().click({ force: true });
    },

    deleteFunctionStop: async (fieldName: string) => {
      const container = this.helper.get.elementByTestId("spec-field-container:" + fieldName);
      await container.locator(".maputnik-delete-stop").first().click({ force: true });
    },

    /** Turns the property into a raw style expression. */
    makeExpression: async (fieldName: string) => {
      const container = this.helper.get.elementByTestId("spec-field-container:" + fieldName);
      await container.scrollIntoViewIfNeeded();
      // In the plain spec field the expression button shares the zoom-function
      // class and comes first; inside a function editor it has its own test id.
      const inFunctionEditor = container.locator("[data-wd-key='convert-to-expression']");
      const button =
        (await inFunctionEditor.count()) > 0
          ? inFunctionEditor
          : container.locator(".maputnik-make-zoom-function").first();
      await button.click({ force: true });
    },

    /** Reverts an expression back to a plain value. */
    undoExpression: async (fieldName: string) => {
      const container = this.helper.get.elementByTestId("spec-field-container:" + fieldName);
      await container.locator("[data-wd-key='undo-expression']").click({ force: true });
    },

    /** Removes an expression, restoring the property's spec default. */
    deleteExpression: async (fieldName: string) => {
      const container = this.helper.get.elementByTestId("spec-field-container:" + fieldName);
      await container.locator("[data-wd-key='delete-expression']").click({ force: true });
    },

    /** Picks the function scale (categorical/interval/exponential/identity/interpolate). */
    selectFunctionType: async (fieldName: string, type: string) => {
      const container = this.helper.get.elementByTestId("spec-field-container:" + fieldName);
      await container.locator("[data-wd-key='function-type'] select").selectOption(type);
    },

    /** Sets the "Base" input of a zoom/data function. */
    setFunctionBase: async (fieldName: string, value: string) => {
      const container = this.helper.get.elementByTestId("spec-field-container:" + fieldName);
      await container.locator("[data-wd-key='function-base'] input").fill(value);
    },

    /**
     * Sets the data property a data function keys off of. This is an InputString,
     * which only commits its value on blur, so typing alone is not enough.
     */
    setFunctionProperty: async (fieldName: string, value: string) => {
      const container = this.helper.get.elementByTestId("spec-field-container:" + fieldName);
      const input = container.locator("[data-wd-key='function-property'] input");
      await input.fill(value);
      await input.blur();
    },

    /** Sets the fallback value used when a feature has no matching stop. */
    setFunctionDefault: async (fieldName: string, value: string) => {
      const container = this.helper.get.elementByTestId("spec-field-container:" + fieldName);
      await container.locator("[data-wd-key='function-default'] input").fill(value);
    },

    /** Edits one cell of a function's stop table ("Zoom", "Input value" or "Output value"). */
    setFunctionStopValue: async (fieldName: string, column: string, index: number, value: string) => {
      const container = this.helper.get.elementByTestId("spec-field-container:" + fieldName);
      await container.locator(`[aria-label="${column}"]`).nth(index).fill(value);
    },

    addFilter: async () => {
      const button = this.helper.get.elementByTestId("layer-filter-button");
      await button.scrollIntoViewIfNeeded();
      await button.click({ force: true });
    },

    selectFilterOperator: async (value: string) => {
      await this.helper.get.element(".maputnik-filter-editor-operator select").first().selectOption(value);
    },

    /** Chooses how the filter items combine: all / none / any. */
    selectFilterCombiningOperator: async (value: string) => {
      await this.helper.when.selectWithin("filter-combining-operator", value);
    },

    deleteFilterItem: async (index = 0) => {
      await this.helper.get
        .element(".maputnik-filter-editor-block-action .maputnik-icon-button")
        .nth(index)
        .click();
    },

    /** Converts the simple filter editor into a raw expression editor. */
    convertFilterToExpression: async () => {
      await this.helper.when.click("filter-convert-to-expression");
    },

    /**
     * Deletes the filter expression, restoring the simple filter editor.
     * The filter group precedes the paint group, so its button comes first.
     */
    deleteFilterExpression: async () => {
      await this.helper.get.element("[data-wd-key='delete-expression']").first().click();
    },

    setColorValue: async (fieldName: string, value: string) => {
      const input = this.helper.get.elementByTestId("spec-field:" + fieldName).locator(".maputnik-color");
      await input.fill(value);
    },

    /** Sets a plain string spec field (e.g. a pattern), which has no dedicated input test id. */
    setStringValue: async (fieldName: string, value: string) => {
      const input = this.helper.get.elementByTestId("spec-field:" + fieldName).locator("input.maputnik-string");
      await input.fill(value);
      await input.blur();
    },

    /**
     * Appends text to the end of the JSON editor line holding `lineText`.
     * CodeMirror types over its own auto-inserted closing quotes/brackets, so a
     * well-formed fragment stays well-formed.
     */
    appendToJsonEditorLine: async (lineText: string, text: string) => {
      await this.helper.when.clickByText(lineText);
      await this.helper.when.typeKeys("{end}");
      await this.helper.when.typeText(text);
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
