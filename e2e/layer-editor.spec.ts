import { v1 as uuid } from "uuid";
import { test, setupMaputnik } from "./fixtures";
import type { MaputnikDriver } from "./maputnik-driver";

test.describe("layer editor", () => {
  setupMaputnik();
  test.beforeEach(async ({ driver }) => {
    await driver.when.setStyle("both");
    await driver.when.modal.open();
  });

  async function createBackground(driver: MaputnikDriver) {
    const { get, when, then } = driver;
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

  test("id", async ({ driver }) => {
    const { get, when, then } = driver;
    const bgId = await createBackground(driver);

    await when.click("layer-list-item:background:" + bgId);

    const id = uuid();
    await when.setValue("layer-editor.layer-id.input", "foobar:" + id);
    await when.click("min-zoom");

    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [{ id: "foobar:" + id, type: "background" }],
    });
  });

  test.describe("source", () => {
    test("should show error when the source is invalid", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.modal.fillLayers({
        type: "circle",
        layer: "invalid",
      });
      await then(
        get.element(".maputnik-input-block--error .maputnik-input-block-label")
      ).shouldHaveCss("color", "rgb(207, 74, 74)");
    });
  });

  test.describe("min-zoom", () => {
    let bgId: string;

    test.beforeEach(async ({ driver }) => {
      const { when } = driver;
      bgId = await createBackground(driver);
      await when.click("layer-list-item:background:" + bgId);
      await when.setValue("min-zoom.input-text", "1");
      await when.click("layer-editor.layer-id");
    });

    test("should update min-zoom in local storage", async ({ driver }) => {
      await driver.then(driver.get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id: "background:" + bgId, type: "background", minzoom: 1 }],
      });
    });

    test("when clicking next layer should update style on local storage", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.type("min-zoom.input-text", "{backspace}");
      await when.click("max-zoom.input-text");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id: "background:" + bgId, type: "background", minzoom: 1 }],
      });
    });
  });

  test.describe("max-zoom", () => {
    let bgId: string;

    test.beforeEach(async ({ driver }) => {
      const { when } = driver;
      bgId = await createBackground(driver);
      await when.click("layer-list-item:background:" + bgId);
      await when.setValue("max-zoom.input-text", "1");
      await when.click("layer-editor.layer-id");
    });

    test("should update style in local storage", async ({ driver }) => {
      await driver.then(driver.get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id: "background:" + bgId, type: "background", maxzoom: 1 }],
      });
    });
  });

  test.describe("comments", () => {
    let bgId: string;
    const comment = "42";

    test.beforeEach(async ({ driver }) => {
      const { when } = driver;
      bgId = await createBackground(driver);
      await when.click("layer-list-item:background:" + bgId);
      await when.setValue("layer-comment.input", comment);
      await when.click("layer-editor.layer-id");
    });

    test("should update style in local storage", async ({ driver }) => {
      await driver.then(driver.get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: "background:" + bgId,
            type: "background",
            metadata: { "maputnik:comment": comment },
          },
        ],
      });
    });

    test.describe("when unsetting", () => {
      test.beforeEach(async ({ driver }) => {
        const { when } = driver;
        await when.clear("layer-comment.input");
        await when.click("min-zoom.input-text");
      });

      test("should update style in local storage", async ({ driver }) => {
        await driver.then(driver.get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [{ id: "background:" + bgId, type: "background" }],
        });
      });
    });
  });

  test.describe("color", () => {
    let bgId: string;
    test.beforeEach(async ({ driver }) => {
      const { when } = driver;
      bgId = await createBackground(driver);
      await when.click("layer-list-item:background:" + bgId);
      await when.click("spec-field:background-color");
    });

    test("should update style in local storage", async ({ driver }) => {
      await driver.then(driver.get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id: "background:" + bgId, type: "background" }],
      });
    });
  });

  test.describe("opacity", () => {
    let bgId: string;
    test.beforeEach(async ({ driver }) => {
      const { when } = driver;
      bgId = await createBackground(driver);
      await when.click("layer-list-item:background:" + bgId);
      await when.type("spec-field-input:background-opacity", "0.");
    });

    test("should keep '.' in the input field", async ({ driver }) => {
      await driver
        .then(driver.get.elementByTestId("spec-field-input:background-opacity"))
        .shouldHaveValue("0.");
    });

    test("should revert to a valid value when focus out", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.click("layer-list-item:background:" + bgId);
      await then(get.elementByTestId("spec-field-input:background-opacity")).shouldHaveValue("0");
    });
  });

  test.describe("filter", () => {
    test.skip("expand/collapse", () => {});
    test.skip("compound filter", () => {});
  });

  test.describe("layout", () => {
    test("text-font", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.setStyle("font");
      await when.collapseGroupInLayerEditor();
      await when.collapseGroupInLayerEditor(1);
      await when.collapseGroupInLayerEditor(2);
      await when.doWithin("spec-field:text-font", async () => {
        await get.element(".maputnik-autocomplete input").first().click();
      });
      await then(get.element(".maputnik-autocomplete-menu-item")).shouldBeVisible();
      await then(get.element(".maputnik-autocomplete-menu-item")).shouldHaveLength(3);
    });
  });

  test.describe("paint", () => {
    test.skip("expand/collapse", () => {});
    test.skip("color", () => {});
    test.skip("pattern", () => {});
    test.skip("opacity", () => {});
  });

  test.describe("json-editor", () => {
    test("add", async ({ driver }) => {
      const { get, when, then } = driver;
      const id = await when.modal.fillLayers({
        type: "circle",
        layer: "example",
      });

      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [{ id, type: "circle", source: "example" }],
      });

      const sourceText = get.elementByText('"source"');
      await sourceText.click();
      await when.typeKeys('"');

      await then(get.element(".cm-lint-marker-error")).shouldExist();
    });

    test.skip("expand/collapse", () => {});
    test.skip("modify", () => {});

    test("parse error", async ({ driver }) => {
      const { get, when, then } = driver;
      const bgId = await createBackground(driver);

      await when.click("layer-list-item:background:" + bgId);
      await when.collapseGroupInLayerEditor();
      await when.collapseGroupInLayerEditor(1);
      await then(get.element(".cm-lint-marker-error")).shouldNotExist();

      await when.appendTextInJsonEditor(
        " {"
      );
      await then(get.element(".cm-lint-marker-error")).shouldExist();
    });
  });

  test.describe("sticky header", () => {
    test("should keep layer header visible when scrolling properties", async ({ driver }) => {
      const { get, when, then } = driver;
      // Setup: Create a layer with many properties (e.g. symbol layer)
      await when.modal.fillLayers({
        type: "symbol",
        layer: "example",
      });

      await when.wait(500);
      const header = get.elementByTestId("layer-editor.header");
      await then(header).shouldBeVisible();

      await get
        .element(".maputnik-scroll-container")
        .evaluate((el) => el.scrollTo(0, el.scrollHeight));
      await when.wait(200);

      await then(header).shouldBeVisible();
      await then(get.elementByTestId("skip-target-layer-editor")).shouldBeVisible();
    });
  });
});
