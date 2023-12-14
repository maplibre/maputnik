var driver = require("../driver");

describe("map", function() {
  describe.skip("zoom level", function() {
    it("via url", async function() {
      var zoomLevel = "12.37";
      await driver.setStyle(["geojson:example"], zoomLevel);
      await browser.waitUntil(async function () {
        return (
          await browser.isVisible(".maplibregl-ctrl-zoom")
          && await browser.getText(".maplibregl-ctrl-zoom") === "Zoom level: "+(zoomLevel)
        );
      }, 10*1000)
    })
    it("via map controls", async function() {
      var zoomLevel = 12.37;
      await driver.setStyle(["geojson:example"], zoomLevel);

      await driver.click(".maplibregl-ctrl-zoom-in");
      await browser.waitUntil(async function () {
        var text = await browser.getText(".maplibregl-ctrl-zoom")
        return text === "Zoom level: "+(zoomLevel+1);
      }, 10*1000)
    })
  })
})
