var assert = require("assert");
import driver from "./driver";
import { v1 as uuid } from 'uuid';

describe("layers", () => {
  beforeEach(() => {
    driver.beforeEach();
    driver.setStyle('both');
    driver.openLayersModal();
  });

  describe("ops", () => {
    it("delete", async () => {
      var styleObj;
      var id = driver.fillLayersModal({
        type: "background"
      })

      styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      driver.click(driver.getDataAttribute("layer-list-item:"+id+":delete", ""))

      styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, []);
    });

    it("duplicate", async () => {
      var styleObj;
      var id = driver.fillLayersModal({
        type: "background"
      })

      styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      driver.click(driver.getDataAttribute("layer-list-item:"+id+":copy", ""));

      styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id+"-copy",
          "type": "background"
        },
        {
          "id": id,
          "type": "background"
        },
      ]);
    });

    it("hide", async () => {
      var styleObj;
      var id = driver.fillLayersModal({
        type: "background"
      })

      styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      driver.click(driver.getDataAttribute("layer-list-item:"+id+":toggle-visibility", ""));

      styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": "background",
          "layout": {
            "visibility": "none"
          }
        },
      ]);

      await driver.click(driver.getDataAttribute("layer-list-item:"+id+":toggle-visibility", ""));

      styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": "background",
          "layout": {
            "visibility": "visible"
          }
        },
      ]);
    })
  })


  describe('background', function () {

    it("add", async () => {
      var id = driver.fillLayersModal({
        type: "background"
      })

      var styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        }
      ]);
    });

    describe("modify", () => {
      async function createBackground() {
        // Setup
        var id = uuid();

        driver.select(driver.getDataAttribute("add-layer.layer-type", "select"), "background");
        driver.setValue(driver.getDataAttribute("add-layer.layer-id", "input"), "background:"+id);

        driver.click(driver.getDataAttribute("add-layer"));

        var styleObj = await driver.getStyleStore();
        assert.deepEqual(styleObj.layers, [
          {
            "id": 'background:'+id,
            "type": 'background'
          }
        ]);
        return id;
      }

      // ====> THESE SHOULD BE FROM THE SPEC
      describe("layer", () => {
        it("expand/collapse");
        it("id", async () => {
          var bgId = await createBackground();

          driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));

          var id = uuid();
          driver.setValue(driver.getDataAttribute("layer-editor.layer-id", "input"), "foobar:"+id)
          driver.click(driver.getDataAttribute("min-zoom"));

          var styleObj = await driver.getStyleStore();
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'foobar:'+id,
              "type": 'background'
            }
          ]);
        });

        it("min-zoom", async () => {
          var bgId = await createBackground();

          driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));
          driver.setValue(driver.getDataAttribute("min-zoom", 'input[type="text"]'), "1");

          driver.click(driver.getDataAttribute("layer-editor.layer-id", "input"));

          var styleObj = await driver.getStyleStore();
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background',
              "minzoom": 1
            }
          ]);

          // AND RESET!
          // await driver.setValue(driver.getDataAttribute("min-zoom", "input"), "")
          // await driver.click(driver.getDataAttribute("max-zoom", "input"));

          // var styleObj = await driver.getStyleStore();

          // assert.deepEqual(styleObj.layers, [
          //   {
          //     "id": 'background:'+bgId,
          //     "type": 'background'
          //   }
          // ]);
        });

        it("max-zoom", async () => {
          var bgId = await createBackground();

          driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));
          driver.setValue(driver.getDataAttribute("max-zoom", 'input[type="text"]'), "1")

          driver.click(driver.getDataAttribute("layer-editor.layer-id", "input"));

          var styleObj = await driver.getStyleStore();
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background',
              "maxzoom": 1
            }
          ]);
        });

        it("comments", async () => {
          var bgId = await createBackground();
          var id = uuid();

          await driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));
          await driver.setValue(driver.getDataAttribute("layer-comment", "textarea"), id);

          await driver.click(driver.getDataAttribute("layer-editor.layer-id", "input"));

          var styleObj = await driver.getStyleStore();
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background',
              metadata: {
                'maputnik:comment': id
              }
            }
          ]);

          // Unset it again.
          // TODO: This fails
          // await driver.setValue(driver.getDataAttribute("layer-comment", "textarea"), "");
          // await driver.click(driver.getDataAttribute("min-zoom", "input"));
          // await driver.zeroTimeout();

          // var styleObj = await driver.getStyleStore();
          // assert.deepEqual(styleObj.layers, [
          //   {
          //     "id": 'background:'+bgId,
          //     "type": 'background'
          //   }
          // ]);
        });

        it("color", async () => {
          var bgId = await createBackground();

          await driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));

          await driver.click(driver.getDataAttribute("spec-field:background-color", "input"));

          var styleObj = await driver.getStyleStore();
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background'
            }
          ]);

        })
      })

      describe("filter", () => {
        it("expand/collapse");
        it("compound filter");
      })

      describe("paint", () => {
        it("expand/collapse");
        it("color");
        it("pattern");
        it("opacity");
      })
      // <=====

      describe("json-editor", () => {
        it("expand/collapse");
        it("modify");

        // TODO
        it.skip("parse error", async () => {
          var bgId = await createBackground();

          driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));

          var errorSelector = ".CodeMirror-lint-marker-error";
          driver.doesNotExists(errorSelector);

          driver.click(".CodeMirror");
          driver.typeKeys("\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013 {");
          driver.isExists(errorSelector);

          driver.click(driver.getDataAttribute("layer-editor.layer-id"));
        });
      });
    })
  });

  describe('fill', () => {
    it("add", async () => {

      var id = driver.fillLayersModal({
        type: "fill",
        layer: "example"
      });

      var styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'fill',
          "source": "example"
        }
      ]);
    })

    // TODO: Change source
    it("change source")
  });

  describe('line', () => {
    it("add", async () => {
      var id = driver.fillLayersModal({
        type: "line",
        layer: "example"
      });

      var styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": "line",
          "source": "example",
        }
      ]);
    });

    it("groups", () => {
      // TODO
      // Click each of the layer groups.
    })
  });

  describe('symbol', () => {
    it("add", async () => {
      var id = driver.fillLayersModal({
        type: "symbol",
        layer: "example"
      });

      var styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": "symbol",
          "source": "example",
        }
      ]);
    });
  });

  describe('raster', () => {
    it("add", async () => {
      var id = driver.fillLayersModal({
        type: "raster",
        layer: "raster"
      });

      var styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": "raster",
          "source": "raster",
        }
      ]);
    });
  });

  describe('circle', () => {
    it("add", async () => {
      var id = driver.fillLayersModal({
        type: "circle",
        layer: "example"
      });

      var styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": "circle",
          "source": "example",
        }
      ]);
    });

  });

  describe('fill extrusion', () => {
    it("add", async () => {
      var id = driver.fillLayersModal({
        type: "fill-extrusion",
        layer: "example"
      });

      var styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'fill-extrusion',
          "source": "example"
        }
      ]);
    });
  });


  describe("groups", () => {
    it("simple", async () => {
      driver.setStyle("geojson");

      driver.openLayersModal();
      driver.fillLayersModal({
        id: "foo",
        type: "background"
      })

      driver.openLayersModal();
      driver.fillLayersModal({
        id: "foo_bar",
        type: "background"
      })

      driver.openLayersModal();
      driver.fillLayersModal({
        id: "foo_bar_baz",
        type: "background"
      })

      driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo"));
      driver.isNotDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo_bar"));
      driver.isNotDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo_bar_baz"));

      driver.click(driver.getDataAttribute("layer-list-group:foo-0"));

      driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo"));
      driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo_bar"));
      driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo_bar_baz"));
    })
  })
});
