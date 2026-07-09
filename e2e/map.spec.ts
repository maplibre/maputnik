import { MaputnikDriver } from "./maputnik-driver";

const test = it;

describe("map", () => {
  const { beforeAndAfter, get, when, then } = new MaputnikDriver();
  beforeAndAfter();
  describe("zoom level", () => {
    test("via url", () => {
      const zoomLevel = 12.37;
      when.setStyle("geojson", zoomLevel);
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldBeVisible();
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldContainText(
        "Zoom: " + zoomLevel
      );
    });

    test("via map controls", () => {
      const zoomLevel = 12.37;
      when.setStyle("geojson", zoomLevel);
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldBeVisible();
      when.clickZoomIn();
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldContainText(
        "Zoom: " + (zoomLevel + 1)
      );
    });

    test("via style file definition", () => {
      when.setStyle("zoom_7_center_0_51");
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldBeVisible();
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldContainText(
        "Zoom: " + (7)
      );
      then(get.locationHash().should("contain", "#7/51/0"));

      // opening another stylefile does not update the map view again
      // as discussed in https://github.com/maplibre/maputnik/issues/1546
      when.openASecondStyleWithDifferentZoomAndCenter();
      then(get.locationHash().should("contain", "#7/51/0"));

    });
  });

  describe("search", () => {
    test("should exist", () => {
      then(get.searchControl()).shouldBeVisible();
    });
  });

  describe("popup", () => {
    beforeEach(() => {
      when.setStyle("rectangles");
      then(get.locationHash().should("exist"));
    });
    test("should open on feature click", () => {
      when.clickCenter("maplibre:map");
      then(get.elementByTestId("feature-layer-popup")).shouldBeVisible();
    });

    test("should open a second feature after closing popup", () => {
      when.clickCenter("maplibre:map");
      then(get.elementByTestId("feature-layer-popup")).shouldBeVisible();
      when.closePopup();
      then(get.elementByTestId("feature-layer-popup")).shouldNotExist();
      when.clickCenter("maplibre:map");
      then(get.elementByTestId("feature-layer-popup")).shouldBeVisible();
    });
  });
});
