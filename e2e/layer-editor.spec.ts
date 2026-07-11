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

  test.skip("expand/collapse", () => {});

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
      // The slider starts at 1 (set via the text input above); one step right lands on 2.
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
    test("compound filter", async () => {
      const id = await when.modal.fillLayers({ type: "fill", layer: "example" });
      await when.addFilter();
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "fill", source: "example", filter: ["all", ["==", "name", ""]] }],
      });

      // Changing the operator updates the compound filter.
      await when.selectFilterOperator("!=");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "fill", source: "example", filter: ["all", ["!=", "name", ""]] }],
      });

      // A second filter item extends the compound filter.
      await when.addFilter();
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "fill", source: "example", filter: ["all", ["!=", "name", ""], ["==", "name", ""]] }],
      });
    });
  });

  describe("functions", () => {
    test("convert a property to a zoom function and add a stop", async () => {
      const id = await when.modal.fillLayers({ type: "circle", layer: "example" });
      await when.makeZoomFunction("circle-radius");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "circle", source: "example", paint: { "circle-radius": { stops: [[6, 5], [10, 5]] } } }],
      });

      await when.addFunctionStop("circle-radius");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "circle", source: "example", paint: { "circle-radius": { stops: [[6, 5], [10, 5], [11, 5]] } } }],
      });

      // Deleting the first stop leaves the rest.
      await when.deleteFunctionStop("circle-radius");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "circle", source: "example", paint: { "circle-radius": { stops: [[10, 5], [11, 5]] } } }],
      });
    });

    test("convert a property to a data function and edit stops", async () => {
      const id = await when.modal.fillLayers({ type: "circle", layer: "example" });
      // The property needs a value before it can be turned into a data function.
      await when.setValue("spec-field-input:circle-blur", "1");
      await when.makeDataFunction("circle-blur");
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

      await when.addFunctionStop("circle-blur");
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
                stops: [[{ zoom: 6, value: 0 }, 1], [{ zoom: 10, value: 0 }, 1], [{ zoom: 11, value: 0 }, 1]],
              },
            },
          },
        ],
      });

      await when.deleteFunctionStop("circle-blur");
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
                stops: [[{ zoom: 10, value: 0 }, 1], [{ zoom: 11, value: 0 }, 1]],
              },
            },
          },
        ],
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
    test.skip("expand/collapse", () => {});
    test.skip("color", () => {});
    test.skip("pattern", () => {});
    test.skip("opacity", () => {});
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

    test.skip("expand/collapse", () => {});
    test.skip("modify", () => {});

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
