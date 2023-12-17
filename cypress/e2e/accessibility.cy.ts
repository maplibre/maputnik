import driver from "./driver";

describe("accessibility", () => {
    // skipped due to the following issue with cypress: https://github.com/cypress-io/cypress/issues/299
  describe.skip("skip links", () => {
    beforeEach(() => {
        driver.beforeEach();
        driver.setStyle("layer");
    });
  
    it("skip link to layer list", () => {
      const selector = driver.getDataAttribute("root:skip:layer-list");
      driver.isExists(selector);
      driver.typeKeys('{tab}');
      driver.isFocused(selector);
      driver.click(selector);
  
      driver.isFocused("#skip-target-layer-list");
    });
  
    it("skip link to layer editor", () => {
      const selector = driver.getDataAttribute("root:skip:layer-editor");
      driver.isExists(selector);
      driver.typeKeys('{tab}{tab}');
      driver.isFocused(selector);
      driver.click(selector);
  
      driver.isFocused("#skip-target-layer-editor");
    });
  
    it("skip link to map view", () => {
      const selector = driver.getDataAttribute("root:skip:map-view");
      driver.isExists(selector);
      driver.typeKeys('{tab}{tab}{tab}');
      driver.isFocused(selector);
      driver.click(selector);
  
      driver.isFocused(".maplibregl-canvas");
    });
  });  
})
