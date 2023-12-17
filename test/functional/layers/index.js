var assert = require("assert");
var driver = require("../driver");
var {v1: uuid} = require('uuid');

describe("layers", function() {
  beforeEach(async function() {
    driver.setStyle([
      "geojson:example",
      "raster:raster"
    ]);
    await driver.openLayersModal();
  });

  describe("ops", function() {
    it("delete", async function() {
      var styleObj;
      var id = await driver.fillLayersModal({
        type: "background"
      })

      styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      await driver.click(driver.getDataAttribute("layer-list-item:"+id+":delete", ""))

      styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
      ]);
    });

    it("duplicate", async function() {
      var styleObj;
      var id = await driver.fillLayersModal({
        type: "background"
      })

      styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      await driver.click(driver.getDataAttribute("layer-list-item:"+id+":copy", ""));

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

    it("hide", async function() {
      var styleObj;
      var id = await driver.fillLayersModal({
        type: "background"
      })

      styleObj = await driver.getStyleStore();
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      await driver.click(driver.getDataAttribute("layer-list-item:"+id+":toggle-visibility", ""));

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

    it("add", async function() {
      var id = await driver.fillLayersModal({
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

    describe("modify", function() {
      async function createBackground() {
        // Setup
        var id = uuid();

        await driver.selectFromDropdown(driver.getDataAttribute("add-layer.layer-type", "select"), "background");
        await driver.setValue(driver.getDataAttribute("add-layer.layer-id", "input"), "background:"+id);

        await driver.click(driver.getDataAttribute("add-layer"));

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
      describe("layer", function() {
        it("expand/collapse");
        it("id", async function() {
          var bgId = await createBackground();

          await driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));

          var id = uuid();
          await driver.setValue(driver.getDataAttribute("layer-editor.layer-id", "input"), "foobar:"+id)
          await driver.click(driver.getDataAttribute("min-zoom"));

          var styleObj = await driver.getStyleStore();
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'foobar:'+id,
              "type": 'background'
            }
          ]);
        });

        it("min-zoom", async function() {
          var bgId = await createBackground();

          await driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));
          await driver.setValue(driver.getDataAttribute("min-zoom", 'input[type="text"]'), 1)

          await driver.click(driver.getDataAttribute("layer-editor.layer-id", "input"));

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

        it("max-zoom", async function() {
          var bgId = await createBackground();

          await driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));
          await driver.setValue(driver.getDataAttribute("max-zoom", 'input[type="text"]'), 1)

          await driver.click(driver.getDataAttribute("layer-editor.layer-id", "input"));

          var styleObj = await driver.getStyleStore();
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background',
              "maxzoom": 1
            }
          ]);
        });

        it("comments", async function() {
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

        it("color", null, async function() {
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

      describe("filter", function() {
        it("expand/collapse");
        it("compound filter");
      })

      describe("paint", function() {
        it("expand/collapse");
        it("color");
        it("pattern");
        it("opacity");
      })
      // <=====

      describe("json-editor", function() {
        it("expand/collapse");
        it("modify");

        // TODO
        it.skip("parse error", async function() {
          var bgId = await createBackground();



          await driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));

          var errorSelector = ".CodeMirror-lint-marker-error";
          assert.equal(await driver.isExisting(errorSelector), false);

          await driver.click(".CodeMirror");
          await driver.keys("\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013 {");
          await driver.waitForExist(errorSelector);

          await driver.click(driver.getDataAttribute("layer-editor.layer-id"));
        });
      });
    })
  });

  describe('fill', function () {
    it("add", async function() {

      var id = await driver.fillLayersModal({
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

  describe('line', function () {
    it("add", async function() {
      var id = await driver.fillLayersModal({
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

    it("groups", null, function() {
      // TODO
      // Click each of the layer groups.
    })
  });

  describe('symbol', function () {
    it("add", async function() {
      var id = await driver.fillLayersModal({
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

  describe('raster', function () {
    it("add", async function() {
      var id = await driver.fillLayersModal({
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

  describe('circle', function () {
    it("add", async function() {
      var id = await driver.fillLayersModal({
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

  describe('fill extrusion', function () {
    it("add", async function() {
      var id = await driver.fillLayersModal({
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


  describe("groups", function() {
    it("simple", async function() {
      await driver.setStyle(["geojson:example"]);

      await driver.openLayersModal();
      await driver.fillLayersModal({
        id: "foo",
        type: "background"
      })

      await driver.openLayersModal();
      await driver.fillLayersModal({
        id: "foo_bar",
        type: "background"
      })

      await driver.openLayersModal();
      await driver.fillLayersModal({
        id: "foo_bar_baz",
        type: "background"
      })

      assert.equal(await driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo")), true);
      assert.equal(await driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo_bar")), false);
      assert.equal(await driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo_bar_baz")), false);

      await driver.click(driver.getDataAttribute("layer-list-group:foo-0"));

      assert.equal(await driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo")), true);
      assert.equal(await driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo_bar")), true);
      assert.equal(await driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo_bar_baz")), true);

    })
  })
});
