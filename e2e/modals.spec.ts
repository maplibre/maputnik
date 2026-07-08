import { test, expect, setupMaputnik } from "./fixtures";
import tokens from "../src/config/tokens.json" with { type: "json" };

test.describe("modals", () => {
  setupMaputnik();

  test.beforeEach(async ({ driver }) => {
    await driver.when.setStyle("");
  });

  test.describe("open", () => {
    test.beforeEach(async ({ driver }) => {
      await driver.when.click("nav:open");
    });

    test("close", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.modal.close("modal:open");
      await then(get.elementByTestId("modal:open")).shouldNotExist();
    });

    test("upload", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.chooseExampleFile();
      await then(get.fixture("example-style.json")).shouldEqualToStoredStyle();
    });

    test("upload via drag and drop", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.dropExampleFile();
      await then(get.fixture("example-style.json")).shouldEqualToStoredStyle();
    });

    test.describe("when click open url", () => {
      test.beforeEach(async ({ driver }) => {
        const { get, when } = driver;
        const styleFileUrl = get.exampleFileUrl();

        await when.setValue("modal:open.url.input", styleFileUrl);
        await when.click("modal:open.url.button");
        await when.wait(200);
      });
      test("load from url", async ({ driver }) => {
        await driver.then(driver.get.responseBody("example-style.json")).shouldEqualToStoredStyle();
      });
    });
  });

  test.describe("shortcuts", () => {
    test("open/close", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.setStyle("");
      await when.typeKeys("?");
      await when.modal.close("modal:shortcuts");
      await then(get.elementByTestId("modal:shortcuts")).shouldNotExist();
    });
  });

  test.describe("export", () => {
    test.beforeEach(async ({ driver }) => {
      await driver.when.click("nav:export");
    });

    test("close", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.modal.close("modal:export");
      await then(get.elementByTestId("modal:export")).shouldNotExist();
    });

    // TODO: Work out how to download a file and check the contents
    test.skip("download", () => {});
  });

  test.describe("sources", () => {
    test.beforeEach(async ({ driver }) => {
      await driver.when.setStyle("layer");
      await driver.when.click("nav:sources");
    });

    test.skip("active sources", () => {});
    test.skip("public source", () => {});

    test("add new source", async ({ driver }) => {
      const { get, when, then } = driver;
      const sourceId = "n1z2v3r";
      await when.setValue("modal:sources.add.source_id", sourceId);
      await when.select("modal:sources.add.source_type", "tile_vector");
      await when.select("modal:sources.add.scheme_type", "tms");
      await when.click("modal:sources.add.add_source");
      await when.wait(200);
      await then(get.styleFromLocalStorage().then((style) => style.sources[sourceId])).shouldInclude({
        scheme: "tms",
      });
    });

    test("add new pmtiles source", async ({ driver }) => {
      const { get, when, then } = driver;
      const sourceId = "pmtilestest";
      await when.setValue("modal:sources.add.source_id", sourceId);
      await when.select("modal:sources.add.source_type", "pmtiles_vector");
      await when.setValue(
        "modal:sources.add.source_url",
        "https://data.source.coop/protomaps/openstreetmap/v4.pmtiles"
      );
      await when.click("modal:sources.add.add_source");
      await when.click("modal:sources.add.add_source");
      await when.wait(200);
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        sources: {
          pmtilestest: {
            type: "vector",
            url: "pmtiles://https://data.source.coop/protomaps/openstreetmap/v4.pmtiles",
          },
        },
      });
    });

    test("add new raster source", async ({ driver }) => {
      const { get, when, then } = driver;
      const sourceId = "rastertest";
      await when.setValue("modal:sources.add.source_id", sourceId);
      await when.select("modal:sources.add.source_type", "tile_raster");
      await when.select("modal:sources.add.scheme_type", "xyz");
      await when.setValue("modal:sources.add.tile_size", "128");
      await when.click("modal:sources.add.add_source");
      await when.wait(200);
      await then(get.styleFromLocalStorage().then((style) => style.sources[sourceId])).shouldInclude({
        tileSize: 128,
      });
    });
  });

  test.describe("inspect", () => {
    test("toggle", async ({ driver }) => {
      // There is no assertion in this test
      await driver.when.setStyle("geojson");
      await driver.when.select("maputnik-select", "inspect");
    });
  });

  test.describe("style settings", () => {
    test.beforeEach(async ({ driver }) => {
      await driver.when.click("nav:settings");
    });

    test.describe("when click name filed spec information", () => {
      test.beforeEach(async ({ driver }) => {
        await driver.when.click("field-doc-button-Name");
      });

      test("should show the spec information", async ({ driver }) => {
        await driver.then(driver.get.elementsText("spec-field-doc")).shouldInclude("name for the style");
      });
    });

    test.describe("when set name and click owner", () => {
      test.beforeEach(async ({ driver }) => {
        const { when } = driver;
        await when.setValue("modal:settings.name", "foobar");
        await when.click("modal:settings.owner");
        await when.wait(200);
      });

      test("show name specifications", async ({ driver }) => {
        await driver.then(driver.get.styleFromLocalStorage()).shouldDeepNestedInclude({
          name: "foobar",
        });
      });
    });

    test.describe("when set owner and click name", () => {
      test.beforeEach(async ({ driver }) => {
        const { when } = driver;
        await when.setValue("modal:settings.owner", "foobar");
        await when.click("modal:settings.name");
        await when.wait(200);
      });
      test("should update owner in local storage", async ({ driver }) => {
        await driver.then(driver.get.styleFromLocalStorage()).shouldDeepNestedInclude({
          owner: "foobar",
        });
      });
    });

    test("sprite url", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.setTextInJsonEditor('"http://example.com"');
      await when.click("modal:settings.name");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        sprite: "http://example.com",
      });
    });

    test("sprite object", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.setTextInJsonEditor(JSON.stringify([{ id: "1", url: "2" }]));

      await when.click("modal:settings.name");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        sprite: [{ id: "1", url: "2" }],
      });
    });

    test("glyphs url", async ({ driver }) => {
      const { get, when, then } = driver;
      const glyphsUrl = "http://example.com/{fontstack}/{range}.pbf";
      await when.setValue("modal:settings.glyphs", glyphsUrl);
      await when.click("modal:settings.name");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        glyphs: glyphsUrl,
      });
    });

    test("maptiler access token", async ({ driver }) => {
      const { get, when, then } = driver;
      const apiKey = "testing123";
      await when.setValue("modal:settings.maputnik:openmaptiles_access_token", apiKey);
      await when.click("modal:settings.name");
      await then(get.styleFromLocalStorage().then((style) => style.metadata)).shouldInclude({
        "maputnik:openmaptiles_access_token": apiKey,
      });
    });

    test("thunderforest access token", async ({ driver }) => {
      const { get, when, then } = driver;
      const apiKey = "testing123";
      await when.setValue("modal:settings.maputnik:thunderforest_access_token", apiKey);
      await when.click("modal:settings.name");
      await then(get.styleFromLocalStorage().then((style) => style.metadata)).shouldInclude({
        "maputnik:thunderforest_access_token": apiKey,
      });
    });

    test("stadia access token", async ({ driver }) => {
      const { get, when, then } = driver;
      const apiKey = "testing123";
      await when.setValue("modal:settings.maputnik:stadia_access_token", apiKey);
      await when.click("modal:settings.name");
      await then(get.styleFromLocalStorage().then((style) => style.metadata)).shouldInclude({
        "maputnik:stadia_access_token": apiKey,
      });
    });

    test("locationiq access token", async ({ driver }) => {
      const { get, when, then } = driver;
      const apiKey = "testing123";
      await when.setValue("modal:settings.maputnik:locationiq_access_token", apiKey);
      await when.click("modal:settings.name");
      await then(get.styleFromLocalStorage().then((style) => style.metadata)).shouldInclude({
        "maputnik:locationiq_access_token": apiKey,
      });
    });

    test("style projection mercator", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.select("modal:settings.projection", "mercator");
      await then(get.styleFromLocalStorage().then((style) => style.projection)).shouldInclude({
        type: "mercator",
      });
    });

    test("style projection globe", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.select("modal:settings.projection", "globe");
      await then(get.styleFromLocalStorage().then((style) => style.projection)).shouldInclude({
        type: "globe",
      });
    });

    test("style projection vertical-perspective", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.select("modal:settings.projection", "vertical-perspective");
      await then(get.styleFromLocalStorage().then((style) => style.projection)).shouldInclude({
        type: "vertical-perspective",
      });
    });

    test("style renderer", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.select("modal:settings.maputnik:renderer", "ol");
      await then(get.inputValue("modal:settings.maputnik:renderer")).shouldEqual("ol");

      await when.click("modal:settings.name");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        metadata: { "maputnik:renderer": "ol" },
      });
    });

    test("include API key when change renderer", async ({ driver }) => {
      const { get, when, given } = driver;

      await when.click("modal:settings.close-modal");
      await when.click("nav:open");

      await get.elementByAttribute("aria-label", "MapTiler Basic").click();
      await when.wait(1000);
      await when.click("nav:settings");

      await when.select("modal:settings.maputnik:renderer", "mlgljs");
      await driver.then(get.inputValue("modal:settings.maputnik:renderer")).shouldEqual("mlgljs");

      await when.select("modal:settings.maputnik:renderer", "ol");
      await driver.then(get.inputValue("modal:settings.maputnik:renderer")).shouldEqual("ol");

      await given.intercept(
        "https://api.maptiler.com/tiles/v3-openmaptiles/tiles.json?key=*",
        "tileRequest",
        "GET"
      );

      await when.select("modal:settings.maputnik:renderer", "mlgljs");
      await driver.then(get.inputValue("modal:settings.maputnik:renderer")).shouldEqual("mlgljs");

      const request = await when.waitForResponse("tileRequest");
      expect(request.url()).toContain(
        `https://api.maptiler.com/tiles/v3-openmaptiles/tiles.json?key=${tokens.openmaptiles}`
      );
    });
  });

  test.describe("add layer", () => {
    test.beforeEach(async ({ driver }) => {
      await driver.when.setStyle("layer");
      await driver.when.modal.open();
    });

    test("shows duplicate id error", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.setValue("add-layer.layer-id.input", "background");
      await when.click("add-layer");
      await then(get.elementByTestId("modal:add-layer")).shouldExist();
      await then(get.element(".maputnik-modal-error")).shouldContainText("Layer ID already exists");
    });
  });

  test.describe("sources placeholder", () => {
    test.skip("toggle", () => {});
  });

  test.describe("global state", () => {
    test.beforeEach(async ({ driver }) => {
      await driver.when.click("nav:global-state");
    });

    test("add variable", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.wait(100);
      await when.click("global-state-add-variable");
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        state: { key1: { default: "value" } },
      });
    });

    test("add multiple variables", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.click("global-state-add-variable");
      await when.click("global-state-add-variable");
      await when.click("global-state-add-variable");
      await when.wait(100);
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        state: { key1: { default: "value" }, key2: { default: "value" }, key3: { default: "value" } },
      });
    });

    test("remove variable", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.click("global-state-add-variable");
      await when.click("global-state-add-variable");
      await when.click("global-state-add-variable");
      await when.click("global-state-remove-variable", 0);
      await when.wait(100);
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        state: { key2: { default: "value" }, key3: { default: "value" } },
      });
    });

    test("edit variable key", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.click("global-state-add-variable");
      await when.wait(100);
      await when.setValue("global-state-variable-key:0", "mykey");
      await when.typeKeys("{enter}");
      await when.wait(100);
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        state: { mykey: { default: "value" } },
      });
    });

    test("edit variable value", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.click("global-state-add-variable");
      await when.wait(100);
      await when.setValue("global-state-variable-value:0", "myvalue");
      await when.typeKeys("{enter}");
      await when.wait(100);
      await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        state: { key1: { default: "myvalue" } },
      });
    });
  });

  test.describe("error panel", () => {
    test("not visible when no errors", async ({ driver }) => {
      await driver.then(driver.get.element("maputnik-message-panel-error")).shouldNotExist();
    });

    test("visible on style error", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.modal.open();
      await when.modal.fillLayers({
        type: "circle",
        layer: "invalid",
      });
      await then(get.element(".maputnik-message-panel-error")).shouldBeVisible();
    });
  });

  test.describe("Handle localStorage QuotaExceededError", () => {
    test("handles quota exceeded error when opening style from URL", async ({ driver, page }) => {
      const { get, when, then } = driver;
      // Clear localStorage to start fresh
      await when.clearLocalStorage();

      // fill localStorage until we get a QuotaExceededError
      await page.evaluate(() => {
        let chunkSize = 1000;
        const chunk = new Array(chunkSize).join("x");
        let index = 0;

        // Keep adding until we hit the quota
        for (;;) {
          try {
            const key = `maputnik:fill-${index++}`;
            window.localStorage.setItem(key, chunk);
          } catch (e: any) {
            // Verify it's a quota error
            if (e.name === "QuotaExceededError") {
              if (chunkSize <= 1) return;
              chunkSize /= 2;
              continue;
            }
            throw e; // Unexpected error
          }
        }
      });

      // Open the style via URL input
      await when.click("nav:open");
      await when.setValue("modal:open.url.input", get.exampleFileUrl());
      await when.click("modal:open.url.button");

      await then(get.responseBody("example-style.json")).shouldEqualToStoredStyle();
      await then(get.styleFromLocalStorage()).shouldExist();
    });
  });
});
