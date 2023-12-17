var assert = require("assert");
var driver = require("../driver");

describe("accessibility", function () {
  describe("skip links", function() {
    beforeEach(async function () {
      await driver.setStyle("example-layer-style.json");
    });
  
    it("skip link to layer list", async function() {
      const selector = driver.getDataAttribute("root:skip:layer-list")
      assert(await driver.isExisting(selector));
      await driver.typeKeys(['Tab']);
      assert(await driver.isFocused(selector));
      await driver.click(selector);
  
      assert(await driver.isFocused("#skip-target-layer-list"));
    });
  
    it("skip link to layer editor", async function() {
      const selector = driver.getDataAttribute("root:skip:layer-editor")
      assert(await driver.isExisting(selector));
      await driver.typeKeys(['Tab']);
      await driver.typeKeys(['Tab']);
      assert(await driver.isFocused(selector));
      await driver.click(selector);
  
      assert(await driver.isFocused("#skip-target-layer-editor"));
    });
  
    it("skip link to map view", async function() {
      const selector = driver.getDataAttribute("root:skip:map-view")
      assert(await driver.isExisting(selector));
      await driver.typeKeys(['Tab']);
      await driver.typeKeys(['Tab']);
      await driver.typeKeys(['Tab']);
      assert(await driver.isFocused(selector));
      await driver.click(selector);
  
      assert(await driver.isFocused(".maplibregl-canvas"));
    });
  });  
})
