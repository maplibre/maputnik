var config = require("../../config/specs");
var helper = require("../helper");


describe("map", function() {
  describe.skip("zoom level", function() {
    it("via url", function() {
      var zoomLevel = "12.37"
      browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
        "geojson:example"
      ])+"#"+zoomLevel+"/41.3805/2.1635");
      browser.alertAccept();

      browser.waitUntil(function () {
        return (
          browser.isVisible(".mapboxgl-ctrl-zoom")
          && browser.getText(".mapboxgl-ctrl-zoom") === "Zoom level: "+(zoomLevel)
        );
      }, 10*1000)
    })
    it("via map controls", function() {
      var zoomLevel = 12.37;
      browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
        "geojson:example"
      ])+"#"+zoomLevel+"/41.3805/2.1635");
      browser.alertAccept();

      browser.click(".mapboxgl-ctrl-zoom-in")
      browser.waitUntil(function () {
        var text = browser.getText(".mapboxgl-ctrl-zoom")
        return text === "Zoom level: "+(zoomLevel+1);
      }, 10*1000)
    })
  })
})
