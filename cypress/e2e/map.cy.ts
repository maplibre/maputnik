import MaputnikDriver from "./driver";

describe("map", () => {
  let { beforeAndAfter, given, when, get, should } = new MaputnikDriver();
  beforeAndAfter();
  describe("zoom level", () => {
    it("via url", () => {
      var zoomLevel = 12.37;
      when.setStyle("geojson", zoomLevel);
      should.beVisible("maplibre:ctrl-zoom");
      should.containText("maplibre:ctrl-zoom", "Zoom: " + zoomLevel);
    });

    it("via map controls", () => {
      var zoomLevel = 12.37;
      when.setStyle("geojson", zoomLevel);

      should.beVisible("maplibre:ctrl-zoom");
      when.clickZoomin();
      should.containText("maplibre:ctrl-zoom", "Zoom: "+(zoomLevel + 1));
    });
  });
});
