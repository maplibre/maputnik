/// <reference types="cypress-plugin-tab" />

import { CypressHelper } from "@shellygo/cypress-test-utils";
import { Assertable, then } from "@shellygo/cypress-test-utils/assertable";
import MaputnikCypressHelper from "./maputnik-cypress-helper";
import ModalDriver from "./modal-driver";
const baseUrl = "http://localhost:8888/";

const styleFromWindow = (win: Window) => {
  const styleId = win.localStorage.getItem("maputnik:latest_style");
  const styleItemKey = `maputnik:style:${styleId}`;
  const styleItem = win.localStorage.getItem(styleItemKey);
  if (!styleItem) throw new Error("Could not get styleItem from localStorage");
  const obj = JSON.parse(styleItem);
  return obj;
};

export class MaputnikAssertable<T> extends Assertable<T> {
  shouldEqualToStoredStyle = () =>
    then(
      new CypressHelper().get.window().then((win: Window) => {
        const style = styleFromWindow(win);
        then(this.chainable).shouldDeepNestedInclude(style);
      })
    );

  shouldHaveUrlHashContaining = (expectedHash: string) =>
    then(
      new MaputnikCypressHelper().get.locationHash().then((hash: string) => {
        expect(hash).to.contain(expectedHash);
      })
    );
  }

export class MaputnikDriver {
  private helper = new MaputnikCypressHelper();
  private modalDriver = new ModalDriver();

  public beforeAndAfter = () => {
    beforeEach(() => {
      this.given.setupMockBackedResponses();
      this.when.setStyle("both");
    });
  };

  public then = (chainable: Cypress.Chainable<any>) =>
    new MaputnikAssertable(chainable);

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
        url: baseUrl + "rectangles-style.json",
        response: {
          fixture: "rectangles-style.json",
        },
      });
      this.helper.given.interceptAndMockResponse({
        method: "GET",
        url: baseUrl + "example-style-with-fonts.json",
        response: {
          fixture: "example-style-with-fonts.json",
        },
      });
      this.helper.given.interceptAndMockResponse({
        method: "GET",
        url: baseUrl + "example-style-with-zoom-and-center.json",
        response: {
          fixture: "example-style-with-zoom-and-center.json",
        },
      });
      this.helper.given.interceptAndMockResponse({
        method: "GET",
        url: baseUrl + "example-style-with-zoom-and-center2.json",
        response: {
          fixture: "example-style-with-zoom-and-center2.json",
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
      this.helper.given.interceptAndMockResponse({
        method: "GET",
        url: "https://www.glyph-server.com/*",
        response: ["Font 1", "Font 2", "Font 3"],
      });
    },
  };

  public when = {
    ...this.helper.when,
    modal: this.modalDriver.when,
    doWithin: (selector: string, fn: () => void) => {
      this.helper.when.doWithin(fn, selector);
    },
    tab: () => this.helper.get.element("body").tab(),
    waitForExampleFileResponse: () => {
      this.helper.when.waitForResponse("example-style.json");
    },
    openASecondStyleWithDifferentZoomAndCenter: () => {
      cy.contains("button", "Open").click();
      cy.get('[data-wd-key="modal:open.url.input"]')
        .should("be.enabled")
        .clear()
        .type("http://localhost:8888/example-style-with-zoom-and-center2.json{enter}");
    },
    chooseExampleFile: () => {
      this.helper.given.fixture("example-style.json", "example-style.json");
      this.helper.when.openFileByFixture("example-style.json", "modal:open.file.button", "modal:open.file.input");
      this.helper.when.wait(200);
    },
    setStyle: (
      styleProperties: "geojson" | "raster" | "both" | "layer" | "rectangles" | "font" | "zoom_center" | "",
      zoom?: number
    ) => {
      const url = new URL(baseUrl);
      switch (styleProperties) {
        case "geojson":
          url.searchParams.set("style", baseUrl + "geojson-style.json");
          break;
        case "raster":
          url.searchParams.set("style", baseUrl + "raster-style.json");
          break;
        case "both":
          url.searchParams.set("style", baseUrl + "geojson-raster-style.json");
          break;
        case "layer":
          url.searchParams.set("style", baseUrl + "example-layer-style.json");
          break;
        case "rectangles":
          url.searchParams.set("style", baseUrl + "rectangles-style.json");
          break;
        case "font":
          url.searchParams.set("style", baseUrl + "example-style-with-fonts.json");
          break;
        case "zoom_center":
          url.searchParams.set("style", baseUrl + "example-style-with-zoom-and-center.json");
          break;
      }

      if (zoom) {
        url.hash = `${zoom}/41.3805/2.1635`;
      }
      this.helper.when.visit(url.toString());
      if (styleProperties) {
        this.helper.when.acceptConfirm();
      }
      // when methods should not include assertions
      const toolbarLink = this.helper.get.elementByTestId("toolbar:link");
      toolbarLink.scrollIntoView();
      toolbarLink.should("be.visible");
    },

    typeKeys: (keys: string) => this.helper.get.element("body").type(keys),

    clickZoomIn: () => {
      this.helper.get.element(".maplibregl-ctrl-zoom-in").click();
    },

    selectWithin: (selector: string, value: string) => {
      this.when.doWithin(selector, () => {
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

    setValueToPropertyArray: (selector: string, value: string) => {
      this.when.doWithin(selector, () => {
        this.helper.get.element(".maputnik-array-block-content input").last().type("{selectall}"+value, {force: true });
      });
    },

    addValueToPropertyArray: (selector: string, value: string) => {
      this.when.doWithin(selector, () => {
        this.helper.get.element(".maputnik-array-add-value").click({ force: true });
        this.helper.get.element(".maputnik-array-block-content input").last().type("{selectall}"+value, {force: true });
      });
    },

    closePopup: () => {
      this.helper.get.element(".maplibregl-popup-close-button").click();
    },

    collapseGroupInLayerEditor: (index = 0) => {
      this.helper.get.element(".maputnik-layer-editor-group__button").eq(index).realClick();
    },

    appendTextInJsonEditor: (text: string) => {
      this.helper.get.element(".cm-line").first().click().type(text, { parseSpecialCharSequences: false });
    },

    setTextInJsonEditor: (text: string) => {
      this.helper.get.element(".cm-line").first().click().clear().type(text, { parseSpecialCharSequences: false });
    }
  };

  public get = {
    ...this.helper.get,
    isMac: () => {
      return Cypress.platform === "darwin";
    },

    styleFromLocalStorage: () =>
      this.helper.get.window().then((win) => styleFromWindow(win)),

    exampleFileUrl: () => {
      return baseUrl + "example-style.json";
    },
    skipTargetLayerList: () =>
      this.helper.get.elementByTestId("skip-target-layer-list"),
    skipTargetLayerEditor: () =>
      this.helper.get.elementByTestId("skip-target-layer-editor"),
    canvas: () => this.helper.get.element("canvas"),
    searchControl: () => this.helper.get.element(".maplibregl-ctrl-geocoder")
  };
}
