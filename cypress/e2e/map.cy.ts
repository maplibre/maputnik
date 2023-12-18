import driver from "./driver";

describe("map", () => {
  describe("zoom level", () => {
    beforeEach(() => {
      driver.beforeEach();
    });
    it("via url", () => {
      const zoomLevel = 12.37;
      driver.setStyle("geojson", zoomLevel);
      driver.isDisplayedInViewport(".maplibregl-ctrl-zoom");
      // HM TODO
      // driver.getText(".maplibregl-ctrl-zoom") === `Zoom ${zoomLevel}`;
    })
    it("via map controls", () => {
      const zoomLevel = 12.37;
      driver.setStyle("geojson", zoomLevel);

      driver.click(".maplibregl-ctrl-zoom-in");
      driver.isDisplayedInViewport(".maplibregl-ctrl-zoom");
      // HM TODO
      // driver.getText(".maplibregl-ctrl-zoom") === `Zoom ${zoomLevel + 1}`;
    })
  })
})
