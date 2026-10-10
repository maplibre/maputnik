import { beforeEach, describe, test } from "./utils/fixtures";
import { MaputnikDriver } from "./maputnik-driver";

describe("map", () => {
  const { given, get, when, then } = new MaputnikDriver();

  beforeEach(async () => {
    await given.setupMockBackedResponses();
    await when.setStyle("both");
  });

  describe("zoom level", () => {
    test("via url", async () => {
      const zoomLevel = 12.37;
      await when.setStyle("geojson", zoomLevel);
      await then(get.elementByTestId("maplibre:ctrl-zoom")).shouldBeVisible();
      await then(get.elementByTestId("maplibre:ctrl-zoom")).shouldContainText("Zoom: " + zoomLevel);
    });

    test("via map controls", async () => {
      const zoomLevel = 12.37;
      await when.setStyle("geojson", zoomLevel);
      await then(get.elementByTestId("maplibre:ctrl-zoom")).shouldBeVisible();
      await when.clickZoomIn();
      await then(get.elementByTestId("maplibre:ctrl-zoom")).shouldContainText("Zoom: " + (zoomLevel + 1));
    });

    test("via style file definition", async () => {
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

  describe("search", () => {
    test("should exist", async () => {
      await then(get.searchControl()).shouldBeVisible();
    });
  });

  describe("popup", () => {
    beforeEach(async () => {
      await when.setStyle("rectangles");
      await then(get.locationHash()).shouldExist();
    });

    test("should open on feature click", async () => {
      await when.clickCenter("maplibre:map");
      await then(get.elementByTestId("feature-layer-popup")).shouldBeVisible();
    });

    test("should open a second feature after closing popup", async () => {
      await when.clickCenter("maplibre:map");
      await then(get.elementByTestId("feature-layer-popup")).shouldBeVisible();
      await when.closePopup();
      await then(get.elementByTestId("feature-layer-popup")).shouldNotExist();
      await when.clickCenter("maplibre:map");
      await then(get.elementByTestId("feature-layer-popup")).shouldBeVisible();
    });
  });
});
