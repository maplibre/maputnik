import { MaputnikDriver } from "./maputnik-driver";

describe("layers list", () => {
  const { beforeAndAfter, get, when, then } = new MaputnikDriver();
  beforeAndAfter();
  beforeEach(() => {
    when.setStyle("both");
    when.modal.open();
  });

  describe("ops", () => {
    let id: string;
    beforeEach(() => {
      id = when.modal.fillLayers({
        type: "background",
      });
    });

    it("should update layers in local storage", () => {
      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "background",
          },
        ],
      });
    });

    describe("when clicking delete", () => {
      beforeEach(() => {
        when.click("layer-list-item:" + id + ":delete");
      });
      it("should empty layers in local storage", () => {
        then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [],
        });
      });
    });

    describe("when clicking duplicate", () => {
      beforeEach(() => {
        when.click("layer-list-item:" + id + ":copy");
      });
      it("should add copy layer in local storage", () => {
        then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [
            {
              id: id + "-copy",
              type: "background",
            },
            {
              id: id,
              type: "background",
            },
          ],
        });
      });
    });

    describe("when clicking hide", () => {
      beforeEach(() => {
        when.click("layer-list-item:" + id + ":toggle-visibility");
      });

      it("should update visibility to none in local storage", () => {
        then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [
            {
              id: id,
              type: "background",
              layout: {
                visibility: "none",
              },
            },
          ],
        });
      });

      describe("when clicking show", () => {
        beforeEach(() => {
          when.click("layer-list-item:" + id + ":toggle-visibility");
        });

        it("should update visibility to visible in local storage", () => {
          then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
            layers: [
              {
                id: id,
                type: "background",
                layout: {
                  visibility: "visible",
                },
              },
            ],
          });
        });
      });

      describe("when selecting a layer", () => {
        let secondId: string;
        beforeEach(() => {
          when.modal.open();
          secondId = when.modal.fillLayers({
            id: "second-layer",
            type: "background",
          });
        });
        it("should show the selected layer in the editor", () => {
          when.realClick("layer-list-item:" + secondId);
          then(get.elementByTestId("layer-editor.layer-id.input")).shouldHaveValue(secondId);
          when.realClick("layer-list-item:" + id);
          then(get.elementByTestId("layer-editor.layer-id.input")).shouldHaveValue(id);
        });
      });
    });
  });

  describe("background", () => {
    it("add", () => {
      const id = when.modal.fillLayers({
        type: "background",
      });
      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "background",
          },
        ],
      });
    });

    describe("modify", () => {});
  });

  describe("fill", () => {
    it("add", () => {
      const id = when.modal.fillLayers({
        type: "fill",
        layer: "example",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "fill",
            source: "example",
          },
        ],
      });
    });

    // TODO: Change source
    it("change source");
  });

  describe("line", () => {
    it("add", () => {
      const id = when.modal.fillLayers({
        type: "line",
        layer: "example",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "line",
            source: "example",
          },
        ],
      });
    });

    it("groups", () => {
      when.modal.open();
      const id1 = when.modal.fillLayers({
        id: "aa",
        type: "line",
        layer: "example",
      });

      when.modal.open();
      const id2 = when.modal.fillLayers({
        id: "aa-2",
        type: "line",
        layer: "example",
      });

      when.modal.open();
      const id3 = when.modal.fillLayers({
        id: "b",
        type: "line",
        layer: "example",
      });

      then(get.elementByTestId("layer-list-item:" + id1)).shouldBeVisible();
      then(get.elementByTestId("layer-list-item:" + id2)).shouldNotBeVisible();
      then(get.elementByTestId("layer-list-item:" + id3)).shouldBeVisible();
      when.click("layer-list-group:aa-0");
      then(get.elementByTestId("layer-list-item:" + id1)).shouldBeVisible();
      then(get.elementByTestId("layer-list-item:" + id2)).shouldBeVisible();
      then(get.elementByTestId("layer-list-item:" + id3)).shouldBeVisible();
      when.click("layer-list-item:" + id2);
      when.click("skip-target-layer-editor");
      when.click("menu-move-layer-down");
      then(get.elementByTestId("layer-list-group:aa-0")).shouldNotExist();
      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: "aa",
            type: "line",
            source: "example",
          },
          {
            id: "b",
            type: "line",
            source: "example",
          },
          {
            id: "aa-2",
            type: "line",
            source: "example",
          },
        ],
      });
    });
  });

  describe("symbol", () => {
    it("add", () => {
      const id = when.modal.fillLayers({
        type: "symbol",
        layer: "example",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "symbol",
            source: "example",
          },
        ],
      });
    });

    it("should show spec info when hovering and clicking single line property", () => {
      when.modal.fillLayers({
        type: "symbol",
        layer: "example",
      });

      when.hover("spec-field-container:text-rotate");
      then(get.elementByTestId("field-doc-button-Rotate")).shouldBeVisible();
      when.click("field-doc-button-Rotate", 0);
      then(get.elementByTestId("spec-field-doc")).shouldContainText("Rotates the ");
    });

    it("should show spec info when hovering and clicking multi line property", () => {
      when.modal.fillLayers({
        type: "symbol",
        layer: "example",
      });

      when.hover("spec-field-container:text-offset");
      then(get.elementByTestId("field-doc-button-Offset")).shouldBeVisible();
      when.click("field-doc-button-Offset", 0);
      then(get.elementByTestId("spec-field-doc")).shouldContainText("Offset distance");
    });

    it("should hide spec info when clicking a second time", () => {
      when.modal.fillLayers({
        type: "symbol",
        layer: "example",
      });

      when.hover("spec-field-container:text-rotate");
      then(get.elementByTestId("field-doc-button-Rotate")).shouldBeVisible();
      when.click("field-doc-button-Rotate", 0);
      when.wait(200);
      when.click("field-doc-button-Rotate", 0);
      then(get.elementByTestId("spec-field-doc")).shouldNotBeVisible();
    });
  });

  describe("raster", () => {
    it("add", () => {
      const id = when.modal.fillLayers({
        type: "raster",
        layer: "raster",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "raster",
            source: "raster",
          },
        ],
      });
    });
  });

  describe("circle", () => {
    it("add", () => {
      const id = when.modal.fillLayers({
        type: "circle",
        layer: "example",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "circle",
            source: "example",
          },
        ],
      });
    });
  });

  describe("fill extrusion", () => {
    it("add", () => {
      const id = when.modal.fillLayers({
        type: "fill-extrusion",
        layer: "example",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "fill-extrusion",
            source: "example",
          },
        ],
      });
    });
  });

  describe("hillshade", () => {
    it("add", () => {
      const id = when.modal.fillLayers({
        type: "hillshade",
        layer: "example",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "hillshade",
            source: "example",
          },
        ],
      });
    });

    it("set hillshade illumination direction array", () => {
      const id = when.modal.fillLayers({
        type: "hillshade",
        layer: "example",
      });
      when.collapseGroupInLayerEditor();
      when.collapseGroupInLayerEditor(1);
      when.setValueToPropertyArray("spec-field:hillshade-illumination-direction", "1");
      when.addValueToPropertyArray("spec-field:hillshade-illumination-direction", "2");
      when.addValueToPropertyArray("spec-field:hillshade-illumination-direction", "3");
      when.addValueToPropertyArray("spec-field:hillshade-illumination-direction", "4");

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "hillshade",
            source: "example",
            paint: {
              "hillshade-illumination-direction": [ 1, 2, 3, 4 ]
            }
          },
        ],
      });
    });

    it("set hillshade highlight color array", () => {
      const id = when.modal.fillLayers({
        type: "hillshade",
        layer: "example",
      });
      when.collapseGroupInLayerEditor();
      when.setValueToPropertyArray("spec-field:hillshade-highlight-color", "blue");
      when.addValueToPropertyArray("spec-field:hillshade-highlight-color", "#00ff00");
      when.addValueToPropertyArray("spec-field:hillshade-highlight-color", "rgba(255, 255, 0, 1)");

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "hillshade",
            source: "example",
            paint: {
              "hillshade-highlight-color": [ "blue", "#00ff00", "rgba(255, 255, 0, 1)" ]
            }
          },
        ],
      });
    });
  });

  describe("color-relief", () => {
    it("add", () => {
      const id = when.modal.fillLayers({
        type: "color-relief",
        layer: "example",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "color-relief",
            source: "example",
          },
        ],
      });
    });

    it("adds elevation expression when clicking the elevation button", () => {
      when.modal.fillLayers({
        type: "color-relief",
        layer: "example",
      });
      when.collapseGroupInLayerEditor();
      when.click("make-elevation-function");
      then(get.element("[data-wd-key='spec-field-container:color-relief-color'] .cm-line")).shouldBeVisible();
    });
  });

  describe("groups", () => {
    it("simple", () => {
      when.setStyle("geojson");

      when.modal.open();
      when.modal.fillLayers({
        id: "foo",
        type: "background",
      });

      when.modal.open();
      when.modal.fillLayers({
        id: "foo_bar",
        type: "background",
      });

      when.modal.open();
      when.modal.fillLayers({
        id: "foo_bar_baz",
        type: "background",
      });

      then(get.elementByTestId("layer-list-item:foo")).shouldBeVisible();
      then(get.elementByTestId("layer-list-item:foo_bar")).shouldNotBeVisible();
      then(
        get.elementByTestId("layer-list-item:foo_bar_baz")
      ).shouldNotBeVisible();
      when.click("layer-list-group:foo-0");
      then(get.elementByTestId("layer-list-item:foo")).shouldBeVisible();
      then(get.elementByTestId("layer-list-item:foo_bar")).shouldBeVisible();
      then(
        get.elementByTestId("layer-list-item:foo_bar_baz")
      ).shouldBeVisible();
    });
  });

  describe("drag and drop", () => {
    it("move layer should update local storage", () => {
      when.modal.open();
      const firstId = when.modal.fillLayers({
        id: "a",
        type: "background",
      });
      when.modal.open();
      const secondId = when.modal.fillLayers({
        id: "b",
        type: "background",
      });
      when.modal.open();
      const thirdId = when.modal.fillLayers({
        id: "c",
        type: "background",
      });

      when.dragAndDropWithWait("layer-list-item:" + firstId, "layer-list-item:" + thirdId);

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: secondId,
            type: "background",
          },
          {
            id: thirdId,
            type: "background",
          },
          {
            id: firstId,
            type: "background",
          },
        ],
      });
    });
  });

  describe("sticky header", () => {
    it("should keep header visible when scrolling layer list", () => {
      // Setup: Create multiple layers to enable scrolling
      for (let i = 0; i < 20; i++) {
        when.modal.open();
        when.modal.fillLayers({
          id: `layer-${i}`,
          type: "background",
        });
      }

      // Wait for layers to render
      when.wait(500);

      // Get the layer list header
      const header = get.element(".maputnik-layer-list-header");

      // Verify header is initially visible
      then(header).shouldBeVisible();

      // Verify header has sticky positioning and proper z-index
      header.should("have.css", "position", "sticky");
      header.should("have.css", "top", "0px");
      header.should("have.css", "z-index", "2001");

      // Scroll the layer list container (use ensureScrollable: false to avoid flakiness)
      get.element(".maputnik-layer-list").scrollTo("bottom", { ensureScrollable: false });
      when.wait(200);

      // Header should still be visible after scrolling
      then(header).shouldBeVisible();

      // Verify "Add Layer" button in header is still clickable
      then(get.elementByTestId("layer-list:add-layer")).shouldBeVisible();
    });

    it("should have opaque background on header", () => {
      const header = get.element(".maputnik-layer-list-header");
      header.should("have.css", "background-color", "rgb(25, 27, 32)");
    });
  });
});
