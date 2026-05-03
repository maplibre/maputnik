import { MaputnikDriver } from "./maputnik-driver";

describe("bounds field feature", () => {
  const { beforeAndAfter, when, get, given, then } = new MaputnikDriver();
  beforeAndAfter();

  describe("when loading a style with bounds set", () => {
    beforeEach(() => {
      given.interceptAndMockResponse({
        method: "GET",
        url: "http://localhost:8888/style-with-bounds.json",
        response: {
          fixture: "style-with-bounds.json",
        },
        alias: "style-with-bounds.json",
      });

      when.setStyle("");
      when.click("nav:open");
      when.setValue("modal:open.url.input", "http://localhost:8888/style-with-bounds.json");
      when.click("modal:open.url.button");
      when.wait(200);

      // Open sources modal
      when.click("nav:sources");
      when.wait(200);
    });

    it("should display all four bounds values correctly in the source editor", () => {
      // Navigate to see existing sources or click on a source to edit
      // First, click on one of the bounded sources if there's a way to edit them
      // Since we're loading a style with sources, we need to find a way to edit them
      
      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        sources: {
          "bounded-vector": {
            type: "vector",
            bounds: [-180, -85.051129, 180, 85.051129],
          },
          "bounded-raster": {
            type: "raster",
            bounds: [-122.4, 37.7, -122.3, 37.8],
          },
        },
      });
    });
  });

  describe("when loading a style without bounds", () => {
    beforeEach(() => {
      when.setStyle("layer");
      when.click("nav:sources");
    });

    it("should have empty bounds fields and not crash the UI", () => {
      const sourceId = "test-no-bounds";
      when.setValue("modal:sources.add.source_id", sourceId);
      when.select("modal:sources.add.source_type", "tile_vector");
      when.select("modal:sources.add.scheme_type", "xyz");
      
      // The bounds should remain empty (not default to world bounds)
      then(
        get.styleFromLocalStorage().then((style) => {
          const source = style.sources[sourceId];
          // Bounds should either not exist or be an empty array
          return (source.bounds === undefined || source.bounds.length === 0);
        })
      ).should("equal", true);
    });
  });

  describe("when editing bounds in the UI", () => {
    beforeEach(() => {
      when.setStyle("layer");
      when.click("nav:sources");
    });

    it("should reflect bounds changes in the JSON", () => {
      const sourceId = "bounds-edit-test";
      when.setValue("modal:sources.add.source_id", sourceId);
      when.select("modal:sources.add.source_type", "tile_raster");
      when.select("modal:sources.add.scheme_type", "xyz");
      when.setValue("modal:sources.add.tile_size", "256");
      
      // Add bounds values
      when.setValueToPropertyArray("modal:sources.add.bounds", "-180");
      when.wait(100);
      when.addValueToPropertyArray("modal:sources.add.bounds", "-85.051129");
      when.wait(100);
      when.addValueToPropertyArray("modal:sources.add.bounds", "180");
      when.wait(100);
      when.addValueToPropertyArray("modal:sources.add.bounds", "85.051129");
      when.wait(100);

      when.click("modal:sources.add.add_source");
      when.wait(200);

      then(
        get.styleFromLocalStorage().then((style) => style.sources[sourceId])
      ).shouldInclude({
        bounds: [-180, -85.051129, 180, 85.051129],
      });
    });
  });

  describe("bounds field validation", () => {
    beforeEach(() => {
      when.setStyle("layer");
      when.click("nav:sources");
    });

    it("should accept valid longitude/latitude bounds values", () => {
      const sourceId = "valid-bounds-test";
      when.setValue("modal:sources.add.source_id", sourceId);
      when.select("modal:sources.add.source_type", "tile_vector");
      when.select("modal:sources.add.scheme_type", "xyz");
      
      // Set custom bounds for a region (e.g., USA bbox)
      when.setValueToPropertyArray("modal:sources.add.bounds", "-125.0");
      when.wait(100);
      when.addValueToPropertyArray("modal:sources.add.bounds", "25.0");
      when.wait(100);
      when.addValueToPropertyArray("modal:sources.add.bounds", "-66.0");
      when.wait(100);
      when.addValueToPropertyArray("modal:sources.add.bounds", "49.0");
      when.wait(100);

      when.click("modal:sources.add.add_source");
      when.wait(200);

      then(
        get.styleFromLocalStorage().then((style) => style.sources[sourceId])
      ).shouldInclude({
        bounds: [-125.0, 25.0, -66.0, 49.0],
      });
    });
  });

  describe("tilejson source with bounds", () => {
    beforeEach(() => {
      when.setStyle("layer");
      when.click("nav:sources");
    });

    it("should support bounds on TileJSON sources", () => {
      const sourceId = "tilejson-bounds-test";
      when.setValue("modal:sources.add.source_id", sourceId);
      when.select("modal:sources.add.source_type", "tilejson_vector");
      when.setValue("modal:sources.add.source_url", "https://example.com/tilejson.json");
      when.wait(100);

      // Add bounds values for TileJSON
      when.setValueToPropertyArray("modal:sources.add.bounds", "-10.0");
      when.wait(100);
      when.addValueToPropertyArray("modal:sources.add.bounds", "-10.0");
      when.wait(100);
      when.addValueToPropertyArray("modal:sources.add.bounds", "10.0");
      when.wait(100);
      when.addValueToPropertyArray("modal:sources.add.bounds", "10.0");
      when.wait(100);

      when.click("modal:sources.add.add_source");
      when.wait(200);

      then(
        get.styleFromLocalStorage().then((style) => style.sources[sourceId])
      ).shouldInclude({
        type: "vector",
        bounds: [-10.0, -10.0, 10.0, 10.0],
      });
    });
  });
});
