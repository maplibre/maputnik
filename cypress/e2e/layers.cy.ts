import { v1 as uuid } from "uuid";
import { MaputnikDriver } from "./maputnik-driver";

describe("layers", () => {
  let { beforeAndAfter, get, when, should, then } = new MaputnikDriver();
  beforeAndAfter();
  beforeEach(() => {
    when.setStyle("both");
    when.modal.open();
  });

  describe("ops", () => {
    let id: string;
    beforeEach(() => {
      id = when.modal.fillLayers({
        type: "background",
      });
    });

    it("should update layers in local storage", () => {
      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "background",
          },
        ],
      });
    });

    describe("when clicking delete", () => {
      beforeEach(() => {
        when.click("layer-list-item:" + id + ":delete");
      });
      it("should empty layers in local storage", () => {
        then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [],
        });
      });
    });

    describe("when clicking duplicate", () => {
      beforeEach(() => {
        when.click("layer-list-item:" + id + ":copy");
      });
      it("should add copy layer in local storage", () => {
        then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [
            {
              id: id + "-copy",
              type: "background",
            },
            {
              id: id,
              type: "background",
            },
          ],
        });
      });
    });

    describe("when clicking hide", () => {
      beforeEach(() => {
        when.click("layer-list-item:" + id + ":toggle-visibility");
      });

      it("should update visibility to none in local storage", () => {
        then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [
            {
              id: id,
              type: "background",
              layout: {
                visibility: "none",
              },
            },
          ],
        });
      });

      describe("when clicking show", () => {
        beforeEach(() => {
          when.click("layer-list-item:" + id + ":toggle-visibility");
        });

        it("should update visibility to visible in local storage", () => {
          then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
            layers: [
              {
                id: id,
                type: "background",
                layout: {
                  visibility: "visible",
                },
              },
            ],
          });
        });
      });
    });
  });
  describe("background", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "background",
      });
      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "background",
          },
        ],
      });
    });

    describe("modify", () => {
      function createBackground() {
        // Setup
        let id = uuid();

        when.selectWithin("add-layer.layer-type", "background");
        when.setValue("add-layer.layer-id.input", "background:" + id);

        when.click("add-layer");

        then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [
            {
              id: "background:" + id,
              type: "background",
            },
          ],
        });
        return id;
      }

      // ====> THESE SHOULD BE FROM THE SPEC
      describe("layer", () => {
        it("expand/collapse");
        it("id", () => {
          let bgId = createBackground();

          when.click("layer-list-item:background:" + bgId);

          let id = uuid();
          when.setValue("layer-editor.layer-id.input", "foobar:" + id);
          when.click("min-zoom");

          then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
            layers: [
              {
                id: "foobar:" + id,
                type: "background",
              },
            ],
          });
        });

        describe("min-zoom", () => {
          let bgId: string;

          beforeEach(() => {
            bgId = createBackground();
            when.click("layer-list-item:background:" + bgId);
            when.setValue("min-zoom.input-text", "1");
            when.click("layer-editor.layer-id");
          });

          it("should update min-zoom in local storage", () => {
            then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
              layers: [
                {
                  id: "background:" + bgId,
                  type: "background",
                  minzoom: 1,
                },
              ],
            });
          });

          it("when clicking next layer should update style on local storage", () => {
            when.type("min-zoom.input-text", "{backspace}");
            when.click("max-zoom.input-text");
            then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
              layers: [
                {
                  id: "background:" + bgId,
                  type: "background",
                  minzoom: 1,
                },
              ],
            });
          });
        });

        describe("max-zoom", () => {
          let bgId: string;

          beforeEach(() => {
            bgId = createBackground();
            when.click("layer-list-item:background:" + bgId);
            when.setValue("max-zoom.input-text", "1");
            when.click("layer-editor.layer-id");
          });

          it("should update style in local storage", () => {
            then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
              layers: [
                {
                  id: "background:" + bgId,
                  type: "background",
                  maxzoom: 1,
                },
              ],
            });
          });
        });

        describe("comments", () => {
          let bgId: string;
          let comment = "42";

          beforeEach(() => {
            bgId = createBackground();
            when.click("layer-list-item:background:" + bgId);
            when.setValue("layer-comment.input", comment);
            when.click("layer-editor.layer-id");
          });

          it("should update style in local storage", () => {
            then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
              layers: [
                {
                  id: "background:" + bgId,
                  type: "background",
                  metadata: {
                    "maputnik:comment": comment,
                  },
                },
              ],
            });
          });

          describe("when unsetting", () => {
            beforeEach(() => {
              when.clear("layer-comment.input");
              when.click("min-zoom.input-text");
            });

            it("should update style in local storage", () => {
              then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
                layers: [
                  {
                    id: "background:" + bgId,
                    type: "background",
                  },
                ],
              });
            });
          });
        });

        describe("color", () => {
          let bgId: string;
          beforeEach(() => {
            bgId = createBackground();
            when.click("layer-list-item:background:" + bgId);
            when.click("spec-field:background-color", 0);
          });

          it("should update style in local storage", () => {
            then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
              layers: [
                {
                  id: "background:" + bgId,
                  type: "background",
                },
              ],
            });
          });
        });
      });

      describe("filter", () => {
        it("expand/collapse");
        it("compound filter");
      });

      describe("paint", () => {
        it("expand/collapse");
        it("color");
        it("pattern");
        it("opacity");
      });
      // <=====

      describe("json-editor", () => {
        it("expand/collapse");
        it("modify");

        // TODO
        it.skip("parse error", () => {
          let bgId = createBackground();

          when.click("layer-list-item:background:" + bgId);

          let errorSelector = ".CodeMirror-lint-marker-error";
          // Not a good idea to check that something doesn't exist. infinite things don't exist.
          then(get.elementByTestId(errorSelector)).shouldNotExist();

          when.click(".CodeMirror");
          when.typeKeys(
            "\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013 {"
          );
          then(get.elementByTestId(errorSelector)).shouldExist();
        });
      });
    });
  });

  describe("fill", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "fill",
        layer: "example",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "fill",
            source: "example",
          },
        ],
      });
    });

    // TODO: Change source
    it("change source");
  });

  describe("line", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "line",
        layer: "example",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "line",
            source: "example",
          },
        ],
      });
    });

    it("groups", () => {
      // TODO
      // Click each of the layer groups.
    });
  });

  describe("symbol", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "symbol",
        layer: "example",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "symbol",
            source: "example",
          },
        ],
      });
    });
  });

  describe("raster", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "raster",
        layer: "raster",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "raster",
            source: "raster",
          },
        ],
      });
    });
  });

  describe("circle", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "circle",
        layer: "example",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "circle",
            source: "example",
          },
        ],
      });
    });
  });

  describe("fill extrusion", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "fill-extrusion",
        layer: "example",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "fill-extrusion",
            source: "example",
          },
        ],
      });
    });
  });

  describe("groups", () => {
    it("simple", () => {
      when.setStyle("geojson");

      when.modal.open();
      when.modal.fillLayers({
        id: "foo",
        type: "background",
      });

      when.modal.open();
      when.modal.fillLayers({
        id: "foo_bar",
        type: "background",
      });

      when.modal.open();
      when.modal.fillLayers({
        id: "foo_bar_baz",
        type: "background",
      });

      then(get.elementByTestId("layer-list-item:foo")).shouldBeVisible();
      then(get.elementByTestId("layer-list-item:foo_bar")).shouldNotBeVisible();
      then(
        get.elementByTestId("layer-list-item:foo_bar_baz")
      ).shouldNotBeVisible();
      when.click("layer-list-group:foo-0");
      then(get.elementByTestId("layer-list-item:foo")).shouldBeVisible();
      then(get.elementByTestId("layer-list-item:foo_bar")).shouldBeVisible();
      then(
        get.elementByTestId("layer-list-item:foo_bar_baz")
      ).shouldBeVisible();
    });
  });
});
