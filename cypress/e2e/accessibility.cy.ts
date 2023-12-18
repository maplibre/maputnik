import MaputnikDriver from "./driver";

describe("accessibility", () => {
  let { beforeAndAfter, given, when, get, should } = new MaputnikDriver();
  beforeAndAfter();

  describe("skip links", () => {
    beforeEach(() => {
      when.setStyle("layer");
    });

    it("skip link to layer list", () => {
      const selector = "root:skip:layer-list";
      should.isExists(selector);
      when.tab();
      should.beFocused(selector);
      when.click(selector);
      should.beFocused("skip-target-layer-list");
    });

    it("skip link to layer editor", () => {
      const selector = "root:skip:layer-editor";
      should.isExists(selector);
      when.tab().tab();
      should.beFocused(selector);
      when.click(selector);
      should.beFocused("skip-target-layer-editor");
    });

    it("skip link to map view", () => {
      const selector = "root:skip:map-view";
      should.isExists(selector);
      when.tab().tab().tab();
      should.beFocused(selector);
      when.click(selector);
      should.canvasBeFocused();
    });
  });
});
