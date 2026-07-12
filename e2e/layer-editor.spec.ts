import { v1 as uuid } from "uuid";
import { beforeEach, describe, test } from "./utils/fixtures";
import { MaputnikDriver } from "./maputnik-driver";

describe("layer editor", () => {
  const { given, get, when, then } = new MaputnikDriver();

  beforeEach(async () => {
    await given.setupMockBackedResponses();
    await when.setStyle("both");
    await when.modal.open();
  });

  async function createBackground() {
    const id = uuid();

    await when.selectWithin("add-layer.layer-type", "background");
    await when.setValue("add-layer.layer-id.input", "background:" + id);

    await when.click("add-layer");

    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [{ id: "background:" + id, type: "background" }],
    });
    return id;
  }

  test("expand/collapse", async () => {
    const bgId = await createBackground();
    await when.click("layer-list-item:background:" + bgId);

    await then(get.elementByTestId("layer-editor.layer-id.input")).shouldBeVisible();

    await when.toggleGroupInLayerEditor("Layer");
    await then(get.elementByTestId("layer-editor.layer-id.input")).shouldNotBeVisible();

    await when.toggleGroupInLayerEditor("Layer");
    await then(get.elementByTestId("layer-editor.layer-id.input")).shouldBeVisible();
  });

  test("id", async () => {
    const bgId = await createBackground();

    await when.click("layer-list-item:background:" + bgId);

    const id = uuid();
    await when.setValue("layer-editor.layer-id.input", "foobar:" + id);
    await when.click("min-zoom");

    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [{ id: "foobar:" + id, type: "background" }],
    });
  });

  describe("source", () => {
    test("should show error when the source is invalid", async () => {
      await when.modal.fillLayers({
        type: "circle",
        layer: "invalid",
      });
      await then(
        get.element(".maputnik-input-block--error .maputnik-input-block-label")
      ).shouldHaveCss("color", "rgb(207, 74, 74)");
    });
  });

  describe("min-zoom", () => {
    let bgId: string;

    beforeEach(async () => {
      bgId = await createBackground();
      await when.click("layer-list-item:background:" + bgId);
      await when.setValue("min-zoom.input-text", "1");
      await when.click("layer-editor.layer-id");
    });

    test("should update min-zoom in local storage", async () => {
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id: "background:" + bgId, type: "background", minzoom: 1 }],
      });
    });

    test("when clicking next layer should update style on local storage", async () => {
      await when.type("min-zoom.input-text", "{backspace}");
      await when.click("max-zoom.input-text");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id: "background:" + bgId, type: "background", minzoom: 1 }],
      });
    });

    test("the range slider adjusts min-zoom", async () => {
      await when.focus("min-zoom.input-range");
      await when.typeKeys("{rightarrow}");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id: "background:" + bgId, type: "background", minzoom: 2 }],
      });
    });
  });

  describe("max-zoom", () => {
    let bgId: string;

    beforeEach(async () => {
      bgId = await createBackground();
      await when.click("layer-list-item:background:" + bgId);
      await when.setValue("max-zoom.input-text", "1");
      await when.click("layer-editor.layer-id");
    });

    test("should update style in local storage", async () => {
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id: "background:" + bgId, type: "background", maxzoom: 1 }],
      });
    });
  });

  describe("comments", () => {
    let bgId: string;
    const comment = "42";

    beforeEach(async () => {
      bgId = await createBackground();
      await when.click("layer-list-item:background:" + bgId);
      await when.setValue("layer-comment.input", comment);
      await when.click("layer-editor.layer-id");
    });

    test("should update style in local storage", async () => {
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: "background:" + bgId,
            type: "background",
            metadata: { "maputnik:comment": comment },
          },
        ],
      });
    });

    describe("when unsetting", () => {
      beforeEach(async () => {
        await when.clear("layer-comment.input");
        await when.click("min-zoom.input-text");
      });

      test("should update style in local storage", async () => {
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id: "background:" + bgId, type: "background" }],
        });
      });
    });
  });

  describe("color", () => {
    let bgId: string;
    beforeEach(async () => {
      bgId = await createBackground();
      await when.click("layer-list-item:background:" + bgId);
      await when.click("spec-field:background-color");
    });

    test("should update style in local storage", async () => {
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id: "background:" + bgId, type: "background" }],
      });
    });

    test("typing a hex value updates the paint color", async () => {
      await when.setColorValue("background-color", "#ff0000");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id: "background:" + bgId, type: "background", paint: { "background-color": "#ff0000" } }],
      });
    });
  });

  describe("opacity", () => {
    let bgId: string;
    beforeEach(async () => {
      bgId = await createBackground();
      await when.click("layer-list-item:background:" + bgId);
      await when.type("spec-field-input:background-opacity", "0.");
    });

    test("should keep '.' in the input field", async () => {
      await then(get.elementByTestId("spec-field-input:background-opacity")).shouldHaveValue("0.");
    });

    test("should revert to a valid value when focus out", async () => {
      await when.click("layer-list-item:background:" + bgId);
      await then(get.elementByTestId("spec-field-input:background-opacity")).shouldHaveValue("0");
    });
  });

  describe("filter", () => {
    let id: string;

    beforeEach(async () => {
      id = await when.modal.fillLayers({ type: "fill", layer: "example" });
      await when.addFilter();
    });

    test("should add a filter item", async () => {
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "fill", source: "example", filter: ["all", ["==", "name", ""]] }],
      });
    });

    test("should change the filter operator", async () => {
      await when.selectFilterOperator("!=");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, filter: ["all", ["!=", "name", ""]] }],
      });
    });

    test("should extend the compound filter with a second item", async () => {
      await when.addFilter();
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, filter: ["all", ["==", "name", ""], ["==", "name", ""]] }],
      });
    });

    test("should change the combining operator", async () => {
      await when.selectFilterCombiningOperator("any");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, filter: ["any", ["==", "name", ""]] }],
      });
    });

    test("should delete a filter item", async () => {
      await when.addFilter();
      await when.deleteFilterItem();
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, filter: ["all", ["==", "name", ""]] }],
      });
    });

    describe("when converted to an expression", () => {
      beforeEach(async () => {
        await when.convertFilterToExpression();
      });

      test("should migrate the filter to an expression", async () => {
        // A single-item "all" collapses to the bare comparison when migrated.
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, filter: ["==", ["get", "name"], ""] }],
        });
      });

      test("should restore the default filter when the expression is deleted", async () => {
        await when.deleteFilterExpression();
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, filter: ["all"] }],
        });
      });
    });
  });

  describe("functions", () => {
    let id: string;

    describe("zoom function", () => {
      beforeEach(async () => {
        id = await when.modal.fillLayers({ type: "circle", layer: "example" });
        await when.makeZoomFunction("circle-radius");
      });

      test("should convert the property to a zoom function", async () => {
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [
            { id, type: "circle", source: "example", paint: { "circle-radius": { stops: [[6, 5], [10, 5]] } } },
          ],
        });
      });

      test("should add a stop", async () => {
        await when.addFunctionStop("circle-radius");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, paint: { "circle-radius": { stops: [[6, 5], [10, 5], [11, 5]] } } }],
        });
      });

      test("should delete the first stop", async () => {
        // A function needs more than two stops, otherwise deleting one collapses
        // it back into a plain value.
        await when.addFunctionStop("circle-radius");
        await when.deleteFunctionStop("circle-radius");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, paint: { "circle-radius": { stops: [[10, 5], [11, 5]] } } }],
        });
      });

      test("should set the base", async () => {
        await when.setFunctionBase("circle-radius", "2");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, paint: { "circle-radius": { base: 2, stops: [[6, 5], [10, 5]] } } }],
        });
      });

      test("should edit the zoom of a stop", async () => {
        await when.setFunctionStopValue("circle-radius", "Zoom", 0, "3");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, paint: { "circle-radius": { stops: [[3, 5], [10, 5]] } } }],
        });
      });

      test("should edit the output value of a stop", async () => {
        await when.setFunctionStopValue("circle-radius", "Output value", 0, "9");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, paint: { "circle-radius": { stops: [[6, 9], [10, 5]] } } }],
        });
      });

      test("should convert to an expression", async () => {
        await when.makeExpression("circle-radius");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, paint: { "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 5, 10, 5] } }],
        });
      });

      describe("when converted to a data function", () => {
        beforeEach(async () => {
          // Any non-interpolate scale turns the zoom function into a data one.
          await when.selectFunctionType("circle-radius", "categorical");
        });

        test("should carry the stops over as zoom/value pairs", async () => {
          await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
            layers: [
              {
                id,
                paint: {
                  "circle-radius": {
                    property: "",
                    type: "exponential",
                    stops: [[{ zoom: 6, value: 0 }, 5], [{ zoom: 10, value: 0 }, 5]],
                  },
                },
              },
            ],
          });
        });

        test("should convert back to a zoom function", async () => {
          await when.selectFunctionType("circle-radius", "interpolate");
          await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
            layers: [{ id, paint: { "circle-radius": { stops: [[6, 5], [10, 5]] } } }],
          });
        });
      });
    });

    describe("data function", () => {
      beforeEach(async () => {
        id = await when.modal.fillLayers({ type: "circle", layer: "example" });
        // The property needs a value before it can be turned into a data function.
        await when.setValue("spec-field-input:circle-blur", "1");
        await when.makeDataFunction("circle-blur");
      });

      test("should convert the property to a data function", async () => {
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [
            {
              id,
              type: "circle",
              source: "example",
              paint: {
                "circle-blur": {
                  property: "",
                  type: "exponential",
                  stops: [[{ zoom: 6, value: 0 }, 1], [{ zoom: 10, value: 0 }, 1]],
                },
              },
            },
          ],
        });
      });

      test("should add a stop", async () => {
        await when.addFunctionStop("circle-blur");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [
            {
              id,
              paint: {
                "circle-blur": {
                  stops: [[{ zoom: 6, value: 0 }, 1], [{ zoom: 10, value: 0 }, 1], [{ zoom: 11, value: 0 }, 1]],
                },
              },
            },
          ],
        });
      });

      test("should delete the first stop", async () => {
        await when.addFunctionStop("circle-blur");
        await when.deleteFunctionStop("circle-blur");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [
            {
              id,
              paint: {
                "circle-blur": {
                  stops: [[{ zoom: 10, value: 0 }, 1], [{ zoom: 11, value: 0 }, 1]],
                },
              },
            },
          ],
        });
      });

      test("should set the property", async () => {
        await when.setFunctionProperty("circle-blur", "myprop");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, paint: { "circle-blur": { property: "myprop" } } }],
        });
      });

      test("should set the default", async () => {
        await when.setFunctionDefault("circle-blur", "0.5");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, paint: { "circle-blur": { default: 0.5 } } }],
        });
      });

      test("should edit the input value of a stop", async () => {
        await when.setFunctionStopValue("circle-blur", "Input value", 0, "7");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [
            {
              id,
              paint: {
                "circle-blur": {
                  stops: [[{ zoom: 6, value: 7 }, 1], [{ zoom: 10, value: 0 }, 1]],
                },
              },
            },
          ],
        });
      });

      test("should change the function type", async () => {
        await when.selectFunctionType("circle-blur", "categorical");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, paint: { "circle-blur": { type: "categorical" } } }],
        });
      });
    });

    describe("expression", () => {
      beforeEach(async () => {
        id = await when.modal.fillLayers({ type: "circle", layer: "example" });
        await when.setValue("spec-field-input:circle-blur", "1");
        await when.makeExpression("circle-blur");
      });

      test("should wrap the property value in a literal expression", async () => {
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, paint: { "circle-blur": ["literal", 1] } }],
        });
      });

      test("should restore the plain value when reverted", async () => {
        await when.undoExpression("circle-blur");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, paint: { "circle-blur": 1 } }],
        });
      });

      test("should fall back to the spec default when deleted", async () => {
        await when.deleteExpression("circle-blur");
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, paint: { "circle-blur": 0 } }],
        });
      });
    });
  });

  describe("layout", () => {
    test("text-font", async () => {
      await when.setStyle("font");
      await when.collapseGroupInLayerEditor();
      await when.collapseGroupInLayerEditor(1);
      await when.collapseGroupInLayerEditor(2);
      await when.clickWithin("spec-field:text-font", ".maputnik-autocomplete input");
      await then(get.element(".maputnik-autocomplete-menu-item")).shouldBeVisible();
      await then(get.element(".maputnik-autocomplete-menu-item")).shouldHaveLength(3);
    });
  });

  describe("paint", () => {
    let id: string;

    beforeEach(async () => {
      id = await when.modal.fillLayers({ type: "fill", layer: "example" });
    });

    test("expand/collapse", async () => {
      await then(get.elementByTestId("spec-field:fill-color")).shouldBeVisible();

      await when.toggleGroupInLayerEditor("Paint properties");
      await then(get.elementByTestId("spec-field:fill-color")).shouldNotBeVisible();

      await when.toggleGroupInLayerEditor("Paint properties");
      await then(get.elementByTestId("spec-field:fill-color")).shouldBeVisible();
    });

    test("color", async () => {
      await when.setColorValue("fill-color", "#ff0000");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "fill", source: "example", paint: { "fill-color": "#ff0000" } }],
      });
    });

    test("pattern", async () => {
      await when.setStringValue("fill-pattern", "some-pattern");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "fill", source: "example", paint: { "fill-pattern": "some-pattern" } }],
      });
    });

    test("opacity", async () => {
      await when.setValue("spec-field-input:fill-opacity", "0.4");
      await when.click("layer-editor.layer-id");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "fill", source: "example", paint: { "fill-opacity": 0.4 } }],
      });
    });
  });

  describe("json-editor", () => {
    test("add", async () => {
      const id = await when.modal.fillLayers({
        type: "circle",
        layer: "example",
      });

      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "circle", source: "example" }],
      });

      await when.clickByText('"source"');
      await when.typeKeys('"');

      await then(get.element(".cm-lint-marker-error")).shouldExist();
    });

    test("expand/collapse", async () => {
      const bgId = await createBackground();
      await when.click("layer-list-item:background:" + bgId);

      await then(get.element(".cm-content")).shouldBeVisible();

      await when.toggleGroupInLayerEditor("JSON Editor");
      await then(get.element(".cm-content")).shouldNotBeVisible();

      await when.toggleGroupInLayerEditor("JSON Editor");
      await then(get.element(".cm-content")).shouldBeVisible();
    });

    test("modify", async () => {
      const bgId = await createBackground();
      await when.click("layer-list-item:background:" + bgId);

      // Append a property to the layer's JSON; the editor writes it back to the style.
      await when.appendToJsonEditorLine('"background"', ',\n"minzoom": 5');
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id: "background:" + bgId, type: "background", minzoom: 5 }],
      });
    });

    test("parse error", async () => {
      const bgId = await createBackground();

      await when.click("layer-list-item:background:" + bgId);
      await when.collapseGroupInLayerEditor();
      await when.collapseGroupInLayerEditor(1);
      await then(get.element(".cm-lint-marker-error")).shouldNotExist();

      // Inject an invalid token (CodeMirror auto-closes brackets/quotes, so a
      // bare word reliably breaks the JSON) and expect a lint error.
      await when.appendTextInJsonEditor("zzz");
      await then(get.element(".cm-lint-marker-error")).shouldExist();
    });
  });

  describe("sticky header", () => {
    test("should keep layer header visible when scrolling properties", async () => {
      // Setup: Create a layer with many properties (e.g. symbol layer)
      await when.modal.fillLayers({
        type: "symbol",
        layer: "example",
      });

      await when.wait(500);
      const header = get.elementByTestId("layer-editor.header");
      await then(header).shouldBeVisible();

      await when.scrollToBottom(get.element(".maputnik-scroll-container"));
      await when.wait(200);

      await then(header).shouldBeVisible();
      await then(get.elementByTestId("skip-target-layer-editor")).shouldBeVisible();
    });
  });
});
