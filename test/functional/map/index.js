var config = require("../../config/specs");
var helper = require("../helper");


describe("map", function() {
  describe.skip("zoom level", function() {
    it("via url", async function() {
      var zoomLevel = "12.37"
      await browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
        "geojson:example"
      ])+"#"+zoomLevel+"/41.3805/2.1635");
      await browser.alertAccept();

      await browser.waitUntil(async function () {
        return (
          await browser.isVisible(".maplibregl-ctrl-zoom")
          && await browser.getText(".maplibregl-ctrl-zoom") === "Zoom level: "+(zoomLevel)
        );
      }, 10*1000)
    })
    it("via map controls", async function() {
      var zoomLevel = 12.37;
      await browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
        "geojson:example"
      ])+"#"+zoomLevel+"/41.3805/2.1635");
      await browser.alertAccept();

      await browser.click(".maplibregl-ctrl-zoom-in")
      await browser.waitUntil(async function () {
        var text = await browser.getText(".maplibregl-ctrl-zoom")
        return text === "Zoom level: "+(zoomLevel+1);
      }, 10*1000)
    })
  })
})
