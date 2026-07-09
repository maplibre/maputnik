import { beforeEach, describe, test } from "./utils/fixtures";
import { MaputnikDriver } from "./maputnik-driver";

describe("layers list", () => {
  const { given, get, when, then } = new MaputnikDriver();

  beforeEach(async () => {
    await given.setupMockBackedResponses();
    await when.setStyle("both");
    await when.modal.open();
  });

  describe("ops", () => {
    let id: string;
    beforeEach(async () => {
      id = await when.modal.fillLayers({ type: "background" });
    });

    test("should update layers in local storage", async () => {
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "background" }],
      });
    });

    describe("when clicking delete", () => {
      beforeEach(async () => {
        await when.click("layer-list-item:" + id + ":delete");
      });
      test("should empty layers in local storage", async () => {
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [],
        });
      });
    });

    describe("when clicking duplicate", () => {
      beforeEach(async () => {
        await when.click("layer-list-item:" + id + ":copy");
      });
      test("should add copy layer in local storage", async () => {
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [
            { id: id + "-copy", type: "background" },
            { id, type: "background" },
          ],
        });
      });
    });

    describe("when clicking hide", () => {
      beforeEach(async () => {
        await when.click("layer-list-item:" + id + ":toggle-visibility");
      });

      test("should update visibility to none in local storage", async () => {
        await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id, type: "background", layout: { visibility: "none" } }],
        });
      });

      describe("when clicking show", () => {
        beforeEach(async () => {
          await when.click("layer-list-item:" + id + ":toggle-visibility");
        });

        test("should update visibility to visible in local storage", async () => {
          await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
            layers: [{ id, type: "background", layout: { visibility: "visible" } }],
          });
        });
      });

      describe("when selecting a layer", () => {
        let secondId: string;
        beforeEach(async () => {
          await when.modal.open();
          secondId = await when.modal.fillLayers({
            id: "second-layer",
            type: "background",
          });
        });
        test("should show the selected layer in the editor", async () => {
          await when.realClick("layer-list-item:" + secondId);
          await then(get.elementByTestId("layer-editor.layer-id.input")).shouldHaveValue(secondId);
          await when.realClick("layer-list-item:" + id);
          await then(get.elementByTestId("layer-editor.layer-id.input")).shouldHaveValue(id);
        });
      });
    });
  });

  describe("background", () => {
    test("add", async () => {
      const id = await when.modal.fillLayers({ type: "background" });
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "background" }],
      });
    });

    test.skip("modify", () => {});
  });

  describe("fill", () => {
    test("add", async () => {
      const id = await when.modal.fillLayers({ type: "fill", layer: "example" });
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "fill", source: "example" }],
      });
    });

    // TODO: Change source
    test.skip("change source", () => {});
  });

  describe("line", () => {
    test("add", async () => {
      const id = await when.modal.fillLayers({ type: "line", layer: "example" });
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "line", source: "example" }],
      });
    });

    test("groups", async () => {
      await when.modal.open();
      const id1 = await when.modal.fillLayers({ id: "aa", type: "line", layer: "example" });

      await when.modal.open();
      const id2 = await when.modal.fillLayers({ id: "aa-2", type: "line", layer: "example" });

      await when.modal.open();
      const id3 = await when.modal.fillLayers({ id: "b", type: "line", layer: "example" });

      await then(get.elementByTestId("layer-list-item:" + id1)).shouldBeVisible();
      await then(get.elementByTestId("layer-list-item:" + id2)).shouldNotBeVisible();
      await then(get.elementByTestId("layer-list-item:" + id3)).shouldBeVisible();
      await when.click("layer-list-group:aa-0");
      await then(get.elementByTestId("layer-list-item:" + id1)).shouldBeVisible();
      await then(get.elementByTestId("layer-list-item:" + id2)).shouldBeVisible();
      await then(get.elementByTestId("layer-list-item:" + id3)).shouldBeVisible();
      await when.click("layer-list-item:" + id2);
      await when.click("skip-target-layer-editor");
      await when.click("menu-move-layer-down");
      await then(get.elementByTestId("layer-list-group:aa-0")).shouldNotExist();
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          { id: "aa", type: "line", source: "example" },
          { id: "b", type: "line", source: "example" },
          { id: "aa-2", type: "line", source: "example" },
        ],
      });
    });
  });

  describe("symbol", () => {
    test("add", async () => {
      const id = await when.modal.fillLayers({ type: "symbol", layer: "example" });
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "symbol", source: "example" }],
      });
    });

    test("should show spec info when hovering and clicking single line property", async () => {
      await when.modal.fillLayers({ type: "symbol", layer: "example" });

      await when.hover("spec-field-container:text-rotate");
      await then(get.elementByTestId("field-doc-button-Rotate")).shouldBeVisible();
      await when.click("field-doc-button-Rotate", 0);
      await then(get.elementByTestId("spec-field-doc")).shouldContainText("Rotates the ");
    });

    test("should show spec info when hovering and clicking multi line property", async () => {
      await when.modal.fillLayers({ type: "symbol", layer: "example" });

      await when.hover("spec-field-container:text-offset");
      await then(get.elementByTestId("field-doc-button-Offset")).shouldBeVisible();
      await when.click("field-doc-button-Offset", 0);
      await then(get.elementByTestId("spec-field-doc")).shouldContainText("Offset distance");
    });

    test("should hide spec info when clicking a second time", async () => {
      await when.modal.fillLayers({ type: "symbol", layer: "example" });

      await when.hover("spec-field-container:text-rotate");
      await then(get.elementByTestId("field-doc-button-Rotate")).shouldBeVisible();
      await when.click("field-doc-button-Rotate", 0);
      await when.wait(200);
      await when.click("field-doc-button-Rotate", 0);
      await then(get.elementByTestId("spec-field-doc")).shouldNotBeVisible();
    });
  });

  describe("raster", () => {
    test("add", async () => {
      const id = await when.modal.fillLayers({ type: "raster", layer: "raster" });
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "raster", source: "raster" }],
      });
    });
  });

  describe("circle", () => {
    test("add", async () => {
      const id = await when.modal.fillLayers({ type: "circle", layer: "example" });
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "circle", source: "example" }],
      });
    });
  });

  describe("fill extrusion", () => {
    test("add", async () => {
      const id = await when.modal.fillLayers({ type: "fill-extrusion", layer: "example" });
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "fill-extrusion", source: "example" }],
      });
    });
  });

  describe("hillshade", () => {
    test("add", async () => {
      const id = await when.modal.fillLayers({ type: "hillshade", layer: "example" });
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "hillshade", source: "example" }],
      });
    });

    test("set hillshade illumination direction array", async () => {
      const id = await when.modal.fillLayers({ type: "hillshade", layer: "example" });
      await when.collapseGroupInLayerEditor();
      await when.collapseGroupInLayerEditor(1);
      await when.setValueToPropertyArray("spec-field:hillshade-illumination-direction", "1");
      await when.addValueToPropertyArray("spec-field:hillshade-illumination-direction", "2");
      await when.addValueToPropertyArray("spec-field:hillshade-illumination-direction", "3");
      await when.addValueToPropertyArray("spec-field:hillshade-illumination-direction", "4");

      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id,
            type: "hillshade",
            source: "example",
            paint: { "hillshade-illumination-direction": [1, 2, 3, 4] },
          },
        ],
      });
    });

    test("set hillshade highlight color array", async () => {
      const id = await when.modal.fillLayers({ type: "hillshade", layer: "example" });
      await when.collapseGroupInLayerEditor();
      await when.setValueToPropertyArray("spec-field:hillshade-highlight-color", "blue");
      await when.addValueToPropertyArray("spec-field:hillshade-highlight-color", "#00ff00");
      await when.addValueToPropertyArray("spec-field:hillshade-highlight-color", "rgba(255, 255, 0, 1)");

      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id,
            type: "hillshade",
            source: "example",
            paint: {
              "hillshade-highlight-color": ["blue", "#00ff00", "rgba(255, 255, 0, 1)"],
            },
          },
        ],
      });
    });
  });

  describe("color-relief", () => {
    test("add", async () => {
      const id = await when.modal.fillLayers({ type: "color-relief", layer: "example" });
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "color-relief", source: "example" }],
      });
    });

    test("adds elevation expression when clicking the elevation button", async () => {
      await when.modal.fillLayers({ type: "color-relief", layer: "example" });
      await when.collapseGroupInLayerEditor();
      await when.click("make-elevation-function");
      await then(
        get.element("[data-wd-key='spec-field-container:color-relief-color'] .cm-line")
      ).shouldBeVisible();
    });
  });

  describe("groups", () => {
    test("simple", async () => {
      await when.setStyle("geojson");

      await when.modal.open();
      await when.modal.fillLayers({ id: "foo", type: "background" });

      await when.modal.open();
      await when.modal.fillLayers({ id: "foo_bar", type: "background" });

      await when.modal.open();
      await when.modal.fillLayers({ id: "foo_bar_baz", type: "background" });

      await then(get.elementByTestId("layer-list-item:foo")).shouldBeVisible();
      await then(get.elementByTestId("layer-list-item:foo_bar")).shouldNotBeVisible();
      await then(get.elementByTestId("layer-list-item:foo_bar_baz")).shouldNotBeVisible();
      await when.click("layer-list-group:foo-0");
      await then(get.elementByTestId("layer-list-item:foo")).shouldBeVisible();
      await then(get.elementByTestId("layer-list-item:foo_bar")).shouldBeVisible();
      await then(get.elementByTestId("layer-list-item:foo_bar_baz")).shouldBeVisible();
    });
  });

  describe("drag and drop", () => {
    test("move layer should update local storage", async () => {
      await when.modal.open();
      const firstId = await when.modal.fillLayers({ id: "a", type: "background" });
      await when.modal.open();
      const secondId = await when.modal.fillLayers({ id: "b", type: "background" });
      await when.modal.open();
      const thirdId = await when.modal.fillLayers({ id: "c", type: "background" });

      await when.dragAndDropWithWait("layer-list-item:" + firstId, "layer-list-item:" + thirdId);

      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          { id: secondId, type: "background" },
          { id: thirdId, type: "background" },
          { id: firstId, type: "background" },
        ],
      });
    });
  });

  describe("sticky header", () => {
    test("should keep header visible when scrolling layer list", async () => {
      // Setup: Create multiple layers to enable scrolling
      for (let i = 0; i < 20; i++) {
        await when.modal.open();
        await when.modal.fillLayers({ id: `layer-${i}`, type: "background" });
      }

      await when.wait(500);
      const header = get.elementByTestId("layer-list.header");
      await then(header).shouldBeVisible();

      // Scroll the layer list container
      await get.elementByTestId("layer-list").evaluate((el) => el.scrollTo(0, el.scrollHeight));
      await when.wait(200);
      await then(header).shouldBeVisible();
      await then(get.elementByTestId("layer-list:add-layer")).shouldBeVisible();
    });
  });
});
