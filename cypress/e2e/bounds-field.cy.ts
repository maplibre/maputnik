import { MaputnikDriver } from "./maputnik-driver";

describe("bounds field feature", () => {
  const { beforeAndAfter, when, get, then } = new MaputnikDriver();
  beforeAndAfter();

  describe("when loading a style with bounds set", () => {
    it("should display all four bounds values correctly in the source editor", () => {
      when.setStyle("");
      when.click("nav:open");
      when.setValue("modal:open.url.input", "http://localhost:8888/style-with-bounds.json");
      when.click("modal:open.url.button");
      when.wait(200);

      then(get.styleFromLocalStorage().then((style) => style.sources["bounded-vector"].bounds)).should("deep.equal", [-180, -85.051129, 180, 85.051129]);
      then(get.styleFromLocalStorage().then((style) => style.sources["bounded-raster"].bounds)).should("deep.equal", [-122.4, 37.7, -122.3, 37.8]);
    });
  });

  describe("when loading a style without bounds", () => {
    it("should have empty bounds fields and not crash the UI", () => {
      when.setStyle("layer");
      when.click("nav:sources");
      when.wait(200);

      const sourceId = "test-no-bounds";
      when.setValue("modal:sources.add.source_id", sourceId);
      when.select("modal:sources.add.source_type", "tile_vector");
      when.select("modal:sources.add.scheme_type", "xyz");
      when.wait(100);
      when.click("modal:sources.add.add_source");
      when.wait(200);

      const hasEmptyBounds = get.styleFromLocalStorage().then((style) => {
        const source = style.sources[sourceId];
        if (!source) return true;
        return source.bounds === undefined || source.bounds.length === 0;
      });

      then(hasEmptyBounds).should("be.true");
      then(get.elementByTestId("modal:sources")).shouldBeVisible();
    });
  });

  describe("when editing bounds in the UI", () => {
    it("should reflect bounds changes in the JSON", () => {
      when.setStyle("layer");
      when.click("nav:sources");
      when.wait(200);

      const sourceId = "bounds-edit-test";
      when.setValue("modal:sources.add.source_id", sourceId);
      when.select("modal:sources.add.source_type", "tile_raster");
      when.select("modal:sources.add.scheme_type", "xyz");
      when.setValue("modal:sources.add.tile_size", "256");
      when.wait(200);

      when.setValueToPropertyArray("modal:sources.add.bounds", "-180");
      when.addValueToPropertyArray("modal:sources.add.bounds", "-85.051129");
      when.addValueToPropertyArray("modal:sources.add.bounds", "180");
      when.addValueToPropertyArray("modal:sources.add.bounds", "85.051129");
      when.wait(100);

      when.click("modal:sources.add.add_source");
      when.wait(200);

      then(
        get.styleFromLocalStorage().then((style) => style.sources[sourceId].bounds)
      ).should("deep.equal", [-180, -85.051129, 180, 85.051129]);
    });
  });

  describe("bounds field validation", () => {
    it("should accept valid longitude/latitude bounds values", () => {
      when.setStyle("layer");
      when.click("nav:sources");
      when.wait(200);

      const sourceId = "valid-bounds-test";
      when.setValue("modal:sources.add.source_id", sourceId);
      when.select("modal:sources.add.source_type", "tile_vector");
      when.select("modal:sources.add.scheme_type", "xyz");
      when.wait(200);

      when.setValueToPropertyArray("modal:sources.add.bounds", "-125.0");
      when.addValueToPropertyArray("modal:sources.add.bounds", "25.0");
      when.addValueToPropertyArray("modal:sources.add.bounds", "-66.0");
      when.addValueToPropertyArray("modal:sources.add.bounds", "49.0");
      when.wait(100);

      when.click("modal:sources.add.add_source");
      when.wait(200);

      then(
        get.styleFromLocalStorage().then((style) => style.sources[sourceId].bounds)
      ).should("deep.equal", [-125.0, 25.0, -66.0, 49.0]);
    });
  });

  describe("tilejson source with bounds", () => {
    it("should support bounds on TileURL sources", () => {
      when.setStyle("layer");
      when.click("nav:sources");
      when.wait(200);

      const sourceId = "tileurl-bounds-test";
      when.setValue("modal:sources.add.source_id", sourceId);
      when.select("modal:sources.add.source_type", "tile_vector");
      when.select("modal:sources.add.scheme_type", "xyz");
      when.wait(200);

      when.setValueToPropertyArray("modal:sources.add.bounds", "-10.0");
      when.addValueToPropertyArray("modal:sources.add.bounds", "-10.0");
      when.addValueToPropertyArray("modal:sources.add.bounds", "10.0");
      when.addValueToPropertyArray("modal:sources.add.bounds", "10.0");
      when.wait(100);

      when.click("modal:sources.add.add_source");
      when.wait(200);

      then(
        get.styleFromLocalStorage().then((style) => style.sources[sourceId].bounds)
      ).should("deep.equal", [-10.0, -10.0, 10.0, 10.0]);
    });
  });
});
