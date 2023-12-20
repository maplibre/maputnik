import { CypressHelper } from "@shellygo/cypress-test-utils";
import { v1 as uuid } from "uuid";
export default class MaputnikDriver {
  private helper = new CypressHelper({ defaultDataAttribute: "data-wd-key" });
  public beforeAndAfter = () => {
    beforeEach(() => {
      this.given.setupInterception();
      this.when.setStyle("both");
    });
  };

  public given = {
    setupInterception: () => {
      cy.intercept("GET", "http://localhost:8888/example-style.json", {
        fixture: "example-style.json",
      }).as("example-style.json");
      cy.intercept("GET", "http://localhost:8888/example-layer-style.json", {
        fixture: "example-layer-style.json",
      });
      cy.intercept("GET", "http://localhost:8888/geojson-style.json", {
        fixture: "geojson-style.json",
      });
      cy.intercept("GET", "http://localhost:8888/raster-style.json", {
        fixture: "raster-style.json",
      });
      cy.intercept("GET", "http://localhost:8888/geojson-raster-style.json", {
        fixture: "geojson-raster-style.json",
      });
      cy.intercept({ method: "GET", url: "*example.local/*" }, []);
      cy.intercept({ method: "GET", url: "*example.com/*" }, []);
    },
  };

  public when = {
    within: (selector: string, fn: () => void) => {
      this.helper.when.within(fn, selector);
    },
    tab: () => cy.get("body").tab(),
    waitForExampleFileRequset: () => {
      this.helper.when.waitForResponse("example-style.json");
    },
    chooseExampleFile: () => {
      cy.get("input[type='file']").selectFile(
        "cypress/fixtures/example-style.json",
        { force: true }
      );
    },
    setStyle: (
      styleProperties: "geojson" | "raster" | "both" | "layer" | "",
      zoom?: number
    ) => {
      let url = "?debug";
      switch (styleProperties) {
        case "geojson":
          url += "&style=http://localhost:8888/geojson-style.json";
          break;
        case "raster":
          url += "&style=http://localhost:8888/raster-style.json";
          break;
        case "both":
          url += "&style=http://localhost:8888/geojson-raster-style.json";
          break;
        case "layer":
          url += "&style=http://localhost:8888/example-layer-style.json";
          break;
      }
      if (zoom) {
        url += "#" + zoom + "/41.3805/2.1635";
      }
      cy.visit("http://localhost:8888/" + url);
      if (styleProperties) {
        cy.on("window:confirm", () => true);
      }
      cy.get(".maputnik-toolbar-link").should("be.visible");
    },
    fillLayersModal: (opts: {type: string, layer?: string, id?: string}) => {
      var type = opts.type;
      var layer = opts.layer;
      var id;
      if (opts.id) {
        id = opts.id;
      } else {
        id = `${type}:${uuid()}`;
      }

      cy.get(
        this.get.dataAttribute("add-layer.layer-type", "select")
      ).select(type);
      cy.get(this.get.dataAttribute("add-layer.layer-id", "input")).type(id);
      if (layer) {
        cy.get(
          this.get.dataAttribute("add-layer.layer-source-block", "input")
        ).type(layer);
      }
      this.when.click("add-layer");

      return id;
    },

    typeKeys: (keys: string) => {
      cy.get("body").type(keys);
    },

    click: (selector: string) => {
      this.helper.when.click(selector);
    },

    clickZoomin: () => {
      cy.get(".maplibregl-ctrl-zoom-in").click();
    },

    selectWithin: (selector: string, value: string) => {
      this.when.within(selector, () => {
        cy.get("select").select(value);
      });
    },

    select: (selector: string, value: string) => {
      this.helper.get.element(selector).select(value);
    },

    focus: (selector: string) => {
      this.helper.when.focus(selector);
    },

    setValue: (selector: string, text: string) => {
      cy.get(selector).clear().type(text, { parseSpecialCharSequences: false });
    },

    closeModal: (key: string) => {
      this.helper.when.waitUntil(() => this.helper.get.element(key));
      this.when.click(key + ".close-modal");
    },

    openLayersModal: () => {
      this.helper.when.click("layer-list:add-layer");

      cy.get(this.get.dataAttribute("modal:add-layer")).should("exist");
      cy.get(this.get.dataAttribute("modal:add-layer")).should("be.visible");
    },
  };

  public get = {
    isMac: () => {
      return Cypress.platform === "darwin";
    },
    styleFromWindow: (win: Window) => {
      const styleId = win.localStorage.getItem("maputnik:latest_style");
      const styleItem = win.localStorage.getItem(`maputnik:style:${styleId}`);
      const obj = JSON.parse(styleItem || "");
      return obj;
    },
    exampleFileUrl: () => {
      return "http://localhost:8888/example-style.json";
    },
    dataAttribute: (key: string, selector?: string): string => {
      return `*[data-wd-key='${key}'] ${selector || ""}`;
    },
  };

  public should = {
    canvasBeFocused: () => {
      this.when.within("maplibre:map", () => {
        cy.get("canvas").should("be.focused");
      });
    },
    notExist: (selector: string) => {
      cy.get(selector).should("not.exist");
    },
    beFocused: (selector: string) => {
      this.helper.get.element(selector).should("have.focus");
    },

    notBeFocused: (selector: string) => {
      this.helper.get.element(selector).should("not.have.focus");
    },

    beVisible: (selector: string) => {
      this.helper.get.element(selector).should("be.visible");
    },

    notBeVisible: (selector: string) => {
      this.helper.get.element(selector).should("not.be.visible");
    },

    equalStyleStore: (getter: (obj: any) => any, styleObj: any) => {
      cy.window().then((win: any) => {
        const obj = this.get.styleFromWindow(win);
        assert.deepEqual(getter(obj), styleObj);
      });
    },

    styleStoreEqualToExampleFileData: () => {
      cy.window().then((win: any) => {
        const obj = this.get.styleFromWindow(win);
        cy.fixture("example-style.json").should("deep.equal", obj);
      });
    },

    exist: (selector: string) => {
      this.helper.get.element(selector).should("exist");
    },
    beSelected: (selector: string, value: string) => {
      this.helper.get.element(selector).find(`option[value="${value}"]`).should("be.selected");
    },
    containText: (selector: string, text: string) => {
      this.helper.get.element(selector).should("contain.text", text);
    }
  };
}
