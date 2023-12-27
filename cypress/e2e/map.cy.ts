import MaputnikDriver from "./maputnik-driver";

describe("map", () => {
  let { beforeAndAfter, when, should } = new MaputnikDriver();
  beforeAndAfter();
  describe("zoom level", () => {
    it("via url", () => {
      let zoomLevel = 12.37;
      when.setStyle("geojson", zoomLevel);
      should.beVisible("maplibre:ctrl-zoom");
      should.containText("maplibre:ctrl-zoom", "Zoom: " + zoomLevel);
    });

    it("via map controls", () => {
      let zoomLevel = 12.37;
      when.setStyle("geojson", zoomLevel);

      should.beVisible("maplibre:ctrl-zoom");
      when.clickZoomin();
      should.containText("maplibre:ctrl-zoom", "Zoom: "+(zoomLevel + 1));
    });
  });
});
