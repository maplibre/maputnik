import { v1 as uuid } from "uuid";
import { MaputnikDriver } from "./maputnik-driver";

describe("layers", () => {
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
          then(
            get.elementByTestId("layer-editor.layer-id.input"),
          ).shouldHaveValue(secondId);
          when.realClick("layer-list-item:" + id);
          then(
            get.elementByTestId("layer-editor.layer-id.input"),
          ).shouldHaveValue(id);
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

    describe("modify", () => {
      function createBackground() {
        // Setup
        const id = uuid();

        when.selectWithin("add-layer.layer-type", "background");
        when.setValue("add-layer.layer-id.input", "background:" + id);

        when.click("add-layer");

        then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [
            {
              id: "background:" + id,
              type: "background",
            },
          ],
        });
        return id;
      }

      // ====> THESE SHOULD BE FROM THE SPEC
      describe("layer", () => {
        it("expand/collapse");
        it("id", () => {
          const bgId = createBackground();

          when.click("layer-list-item:background:" + bgId);

          const id = uuid();
          when.setValue("layer-editor.layer-id.input", "foobar:" + id);
          when.click("min-zoom");

          then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
            layers: [
              {
                id: "foobar:" + id,
                type: "background",
              },
            ],
          });
        });

        describe("min-zoom", () => {
          let bgId: string;

          beforeEach(() => {
            bgId = createBackground();
            when.click("layer-list-item:background:" + bgId);
            when.setValue("min-zoom.input-text", "1");
            when.click("layer-editor.layer-id");
          });

          it("should update min-zoom in local storage", () => {
            then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
              layers: [
                {
                  id: "background:" + bgId,
                  type: "background",
                  minzoom: 1,
                },
              ],
            });
          });

          it("when clicking next layer should update style on local storage", () => {
            when.type("min-zoom.input-text", "{backspace}");
            when.click("max-zoom.input-text");
            then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
              layers: [
                {
                  id: "background:" + bgId,
                  type: "background",
                  minzoom: 1,
                },
              ],
            });
          });
        });

        describe("max-zoom", () => {
          let bgId: string;

          beforeEach(() => {
            bgId = createBackground();
            when.click("layer-list-item:background:" + bgId);
            when.setValue("max-zoom.input-text", "1");
            when.click("layer-editor.layer-id");
          });

          it("should update style in local storage", () => {
            then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
              layers: [
                {
                  id: "background:" + bgId,
                  type: "background",
                  maxzoom: 1,
                },
              ],
            });
          });
        });

        describe("comments", () => {
          let bgId: string;
          const comment = "42";

          beforeEach(() => {
            bgId = createBackground();
            when.click("layer-list-item:background:" + bgId);
            when.setValue("layer-comment.input", comment);
            when.click("layer-editor.layer-id");
          });

          it("should update style in local storage", () => {
            then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
              layers: [
                {
                  id: "background:" + bgId,
                  type: "background",
                  metadata: {
                    "maputnik:comment": comment,
                  },
                },
              ],
            });
          });

          describe("when unsetting", () => {
            beforeEach(() => {
              when.clear("layer-comment.input");
              when.click("min-zoom.input-text");
            });

            it("should update style in local storage", () => {
              then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
                layers: [
                  {
                    id: "background:" + bgId,
                    type: "background",
                  },
                ],
              });
            });
          });
        });

        describe("color", () => {
          let bgId: string;
          beforeEach(() => {
            bgId = createBackground();
            when.click("layer-list-item:background:" + bgId);
            when.click("spec-field:background-color");
          });

          it("should update style in local storage", () => {
            then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
              layers: [
                {
                  id: "background:" + bgId,
                  type: "background",
                },
              ],
            });
          });
        });

        describe("opacity", () => {
          let bgId: string;
          beforeEach(() => {
            bgId = createBackground();
            when.click("layer-list-item:background:" + bgId);
            when.type("spec-field-input:background-opacity", "0.");
          });

          it("should keep '.' in the input field", () => {
            then(
              get.elementByTestId("spec-field-input:background-opacity"),
            ).shouldHaveValue("0.");
          });

          it("should revert to a valid value when focus out", () => {
            when.click("layer-list-item:background:" + bgId);
            then(
              get.elementByTestId("spec-field-input:background-opacity"),
            ).shouldHaveValue("0");
          });
        });
      });

      describe("filter", () => {
        it("expand/collapse");
        it("compound filter");
      });

      describe("paint", () => {
        it("expand/collapse");
        it("color");
        it("pattern");
        it("opacity");
      });
      // <=====

      describe("json-editor", () => {
        it("expand/collapse");
        it("modify");

        // TODO
        it.skip("parse error", () => {
          const bgId = createBackground();

          when.click("layer-list-item:background:" + bgId);

          const errorSelector = ".CodeMirror-lint-marker-error";
          then(get.elementByTestId(errorSelector)).shouldNotExist();

          when.click(".CodeMirror");
          when.typeKeys(
            "\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013 {",
          );
          then(get.elementByTestId(errorSelector)).shouldExist();
        });
      });
    });
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
      then(get.elementByTestId("spec-field-doc")).shouldContainText(
        "Rotates the ",
      );
    });

    it("should show spec info when hovering and clicking multi line property", () => {
      when.modal.fillLayers({
        type: "symbol",
        layer: "example",
      });

      when.hover("spec-field-container:text-offset");
      then(get.elementByTestId("field-doc-button-Offset")).shouldBeVisible();
      when.click("field-doc-button-Offset", 0);
      then(get.elementByTestId("spec-field-doc")).shouldContainText(
        "Offset distance",
      );
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
      when.setValueToPropertyArray(
        "spec-field:hillshade-illumination-direction",
        "1",
      );
      when.addValueToPropertyArray(
        "spec-field:hillshade-illumination-direction",
        "2",
      );
      when.addValueToPropertyArray(
        "spec-field:hillshade-illumination-direction",
        "3",
      );
      when.addValueToPropertyArray(
        "spec-field:hillshade-illumination-direction",
        "4",
      );

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "hillshade",
            source: "example",
            paint: {
              "hillshade-illumination-direction": [1, 2, 3, 4],
            },
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
      when.setValueToPropertyArray(
        "spec-field:hillshade-highlight-color",
        "blue",
      );
      when.addValueToPropertyArray(
        "spec-field:hillshade-highlight-color",
        "#00ff00",
      );
      when.addValueToPropertyArray(
        "spec-field:hillshade-highlight-color",
        "rgba(255, 255, 0, 1)",
      );

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "hillshade",
            source: "example",
            paint: {
              "hillshade-highlight-color": [
                "blue",
                "#00ff00",
                "rgba(255, 255, 0, 1)",
              ],
            },
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
      then(
        get.element(
          "[data-wd-key='spec-field-container:color-relief-color'] .CodeMirror-line",
        ),
      ).shouldBeVisible();
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
        get.elementByTestId("layer-list-item:foo_bar_baz"),
      ).shouldNotBeVisible();
      when.click("layer-list-group:foo-0");
      then(get.elementByTestId("layer-list-item:foo")).shouldBeVisible();
      then(get.elementByTestId("layer-list-item:foo_bar")).shouldBeVisible();
      then(
        get.elementByTestId("layer-list-item:foo_bar_baz"),
      ).shouldBeVisible();
    });
  });

  describe("layereditor jsonlint should error", () => {
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

      const sourceText = get.elementByText('"source"');

      sourceText.click();
      sourceText.type('"');

      const error = get.element(".CodeMirror-lint-marker-error");
      error.should("exist");
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

      when.dragAndDropWithWait(
        "layer-list-item:" + firstId,
        "layer-list-item:" + thirdId,
      );

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
});
