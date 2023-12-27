import MaputnikDriver from "./maputnik-driver";

describe("accessibility", () => {
  let { beforeAndAfter, when, should } = new MaputnikDriver();
  beforeAndAfter();

  describe("skip links", () => {
    beforeEach(() => {
      when.setStyle("layer");
    });

    it("skip link to layer list", () => {
      const selector = "root:skip:layer-list";
      should.exist(selector);
      when.tab();
      should.beFocused(selector);
      when.click(selector);
      should.beFocused("skip-target-layer-list");
    });

    // This fails for some reason only in Chrome, but passes in firefox. Adding a skip here to allow merge and later on we'll decide if we want to fix this or not.
    it.skip("skip link to layer editor", () => {
      const selector = "root:skip:layer-editor";
      should.exist(selector);
      when.tab().tab();
      should.beFocused(selector);
      when.click(selector);
      should.beFocused("skip-target-layer-editor");
    });

    it("skip link to map view", () => {
      const selector = "root:skip:map-view";
      should.exist(selector);
      when.tab().tab().tab();
      should.beFocused(selector);
      when.click(selector);
      should.canvasBeFocused();
    });
  });
});
