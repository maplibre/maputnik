import {
  Assertable,
  then as baseThen,
} from "@shellygo/cypress-test-utils/assertable";
import CypressWrapperDriver from "./cypress-wrapper-driver";
import ModalDriver from "./modal-driver";
const baseUrl = "http://localhost:8888/";

export class MaputnikAssertable<T> extends Assertable<T> {
  private getStyleFromWindow = (win: Window) => {
    const styleId = win.localStorage.getItem("maputnik:latest_style");
    const styleItem = win.localStorage.getItem(`maputnik:style:${styleId}`);
    const obj = JSON.parse(styleItem || "");
    return obj;
  };
  shouldIncludeLocalStrorageStyle = (styleObj: Object) =>
    baseThen(
      cy.window().then((win) => this.getStyleFromWindow(win))
    ).shouldDeepNestedInclude(styleObj);

  shouldHaveLocalStorageStyle = (styleObj: Object) =>
    baseThen(
      cy.window().then((win) => this.getStyleFromWindow(win))
    ).shouldDeepEqual(styleObj);
}

export const then = (chainable: Cypress.Chainable<any>) =>
  new MaputnikAssertable(chainable);

export class MaputnikDriver {
  private helper = new CypressWrapperDriver();
  private modalDriver = new ModalDriver();

  public beforeAndAfter = () => {
    beforeEach(() => {
      this.given.setupMockBackedResponses();
      this.when.setStyle("both");
    });
  };

  public given = {
    ...this.helper.given,
    setupMockBackedResponses: () => {
      this.helper.given.interceptAndMockResponse({
        method: "GET",
        url: baseUrl + "example-style.json",
        response: {
          fixture: "example-style.json",
        },
        alias: "example-style.json",
      });
      this.helper.given.interceptAndMockResponse({
        method: "GET",
        url: baseUrl + "example-layer-style.json",
        response: {
          fixture: "example-layer-style.json",
        },
      });
      this.helper.given.interceptAndMockResponse({
        method: "GET",
        url: baseUrl + "geojson-style.json",
        response: {
          fixture: "geojson-style.json",
        },
      });
      this.helper.given.interceptAndMockResponse({
        method: "GET",
        url: baseUrl + "raster-style.json",
        response: {
          fixture: "raster-style.json",
        },
      });
      this.helper.given.interceptAndMockResponse({
        method: "GET",
        url: baseUrl + "geojson-raster-style.json",
        response: {
          fixture: "geojson-raster-style.json",
        },
      });
      this.helper.given.interceptAndMockResponse({
        method: "GET",
        url: "*example.local/*",
        response: [],
      });
      this.helper.given.interceptAndMockResponse({
        method: "GET",
        url: "*example.com/*",
        response: [],
      });
    },
  };

  public when = {
    ...this.helper.when,
    modal: this.modalDriver.when,
    within: (selector: string, fn: () => void) => {
      this.helper.when.within(fn, selector);
    },
    tab: () => this.helper.get.element("body").tab(),
    waitForExampleFileResponse: () => {
      this.helper.when.waitForResponse("example-style.json");
    },
    chooseExampleFile: () => {
      this.helper.get
        .bySelector("type", "file")
        .selectFile("cypress/fixtures/example-style.json", { force: true });
    },
    setStyle: (
      styleProperties: "geojson" | "raster" | "both" | "layer" | "",
      zoom?: number
    ) => {
      let url = "?debug";
      switch (styleProperties) {
      case "geojson":
        url += `&style=${baseUrl}geojson-style.json`;
        break;
      case "raster":
        url += `&style=${baseUrl}raster-style.json`;
        break;
      case "both":
        url += `&style=${baseUrl}geojson-raster-style.json`;
        break;
      case "layer":
        url += `&style=${baseUrl}/example-layer-style.json`;
        break;
      }
      if (zoom) {
        url += `#${zoom}/41.3805/2.1635`;
      }
      this.helper.when.visit(baseUrl + url);
      if (styleProperties) {
        this.helper.when.confirmAlert();
      }
      // when methods should not include assertions
      this.helper.get.elementByTestId("toolbar:link").should("be.visible");
    },

    typeKeys: (keys: string) => this.helper.get.element("body").type(keys),

    clickZoomIn: () => {
      this.helper.get.element(".maplibregl-ctrl-zoom-in").click();
    },

    selectWithin: (selector: string, value: string) => {
      this.when.within(selector, () => {
        this.helper.get.element("select").select(value);
      });
    },

    select: (selector: string, value: string) => {
      this.helper.get.elementByTestId(selector).select(value);
    },

    focus: (selector: string) => {
      this.helper.when.focus(selector);
    },

    setValue: (selector: string, text: string) => {
      this.helper.get
        .elementByTestId(selector)
        .clear()
        .type(text, { parseSpecialCharSequences: false });
    },
  };

  public get = {
    ...this.helper.get,
    isMac: () => {
      return Cypress.platform === "darwin";
    },
    styleFromWindow: (win: Window) => {
      const styleId = win.localStorage.getItem("maputnik:latest_style");
      const styleItem = win.localStorage.getItem(`maputnik:style:${styleId}`);
      const obj = JSON.parse(styleItem || "");
      return obj;
    },

    maputnikStyleFromLocalStorageObj: () => {
      const styleId = localStorage.getItem("maputnik:latest_style");
      const styleItem = localStorage.getItem(`maputnik:style:${styleId}`);
      const obj = JSON.parse(styleItem || "");
      console.log(obj);
      return obj;
    },
    maputnikStyleFromLocalStorage: () => {
      return cy.wrap(this.get.maputnikStyleFromLocalStorageObj());
    },
    exampleFileUrl: () => {
      return baseUrl + "example-style.json";
    },
    skipTargetLayerList: () =>
      this.helper.get.elementByTestId("skip-target-layer-list"),
    skipTargetLayerEditor: () =>
      this.helper.get.elementByTestId("skip-target-layer-editor"),
    canvas: () => this.helper.get.element("canvas"),
  };

  public should = {
    notExist: (selector: string) => {
      this.helper.get.element(selector).should("not.exist");
    },
    beFocused: (selector: string) => {
      this.helper.get.elementByTestId(selector).should("have.focus");
    },

    notBeFocused: (selector: string) => {
      this.helper.get.elementByTestId(selector).should("not.have.focus");
    },

    equalStyleStore: (getter: (obj: any) => any, styleObj: any) => {
      cy.window().then((win: any) => {
        const obj = this.get.styleFromWindow(win);
        assert.deepEqual(getter(obj), styleObj);
      });
    },

    beSelected: (selector: string, value: string) => {
      this.helper.get
        .elementByTestId(selector)
        .find(`option[value="${value}"]`)
        .should("be.selected");
    },
  };
}
