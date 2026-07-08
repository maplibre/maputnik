import { test, setupMaputnik } from "./fixtures";

test.describe("map", () => {
  setupMaputnik();

  test.describe("zoom level", () => {
    test("via url", async ({ driver }) => {
      const { get, when, then } = driver;
      const zoomLevel = 12.37;
      await when.setStyle("geojson", zoomLevel);
      await then(get.elementByTestId("maplibre:ctrl-zoom")).shouldBeVisible();
      await then(get.elementByTestId("maplibre:ctrl-zoom")).shouldContainText("Zoom: " + zoomLevel);
    });

    test("via map controls", async ({ driver }) => {
      const { get, when, then } = driver;
      const zoomLevel = 12.37;
      await when.setStyle("geojson", zoomLevel);
      await then(get.elementByTestId("maplibre:ctrl-zoom")).shouldBeVisible();
      await when.clickZoomIn();
      await then(get.elementByTestId("maplibre:ctrl-zoom")).shouldContainText("Zoom: " + (zoomLevel + 1));
    });

    test("via style file definition", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.setStyle("zoom_7_center_0_51");
      await then(get.elementByTestId("maplibre:ctrl-zoom")).shouldBeVisible();
      await then(get.elementByTestId("maplibre:ctrl-zoom")).shouldContainText("Zoom: " + 7);
      await then(get.locationHash()).shouldInclude("#7/51/0");

      // opening another stylefile does not update the map view again
      // as discussed in https://github.com/maplibre/maputnik/issues/1546
      await when.openASecondStyleWithDifferentZoomAndCenter();
      await then(get.locationHash()).shouldInclude("#7/51/0");
    });
  });

  test.describe("search", () => {
    test("should exist", async ({ driver }) => {
      const { get, then } = driver;
      await then(get.searchControl()).shouldBeVisible();
    });
  });

  test.describe("popup", () => {
    test.beforeEach(async ({ driver }) => {
      await driver.when.setStyle("rectangles");
      await driver.then(driver.get.locationHash()).shouldExist();
    });

    test("should open on feature click", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.clickCenter("maplibre:map");
      await then(get.elementByTestId("feature-layer-popup")).shouldBeVisible();
    });

    test("should open a second feature after closing popup", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.clickCenter("maplibre:map");
      await then(get.elementByTestId("feature-layer-popup")).shouldBeVisible();
      await when.closePopup();
      await then(get.elementByTestId("feature-layer-popup")).shouldNotExist();
      await when.clickCenter("maplibre:map");
      await then(get.elementByTestId("feature-layer-popup")).shouldBeVisible();
    });
  });
});
