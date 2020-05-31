var assert = require("assert");
var config = require("../../config/specs");
var helper = require("../helper");
var uuid   = require('uuid/v1');
var wd     = require("../../wd-helper");


describe("layers", function() {
  beforeEach(function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example",
      "raster:raster"
    ]));
    browser.acceptAlert();
    const elem = $(".maputnik-toolbar-link");
    elem.waitForExist();
    browser.flushReactUpdates();

    helper.modal.addLayer.open();
  });

  describe("ops", function() {
    it("delete", function() {
      var styleObj;
      var id = helper.modal.addLayer.fill({
        type: "background"
      })

      styleObj = helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      const elem = $(wd.$("layer-list-item:"+id+":delete", ""));
      elem.click();

      styleObj = helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
      ]);
    });

    it("duplicate", function() {
      var styleObj;
      var id = helper.modal.addLayer.fill({
        type: "background"
      })

      styleObj = helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      const elem = $(wd.$("layer-list-item:"+id+":copy", ""));
      elem.click();

      styleObj = helper.getStyleStore(browser);
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

    it("hide", function() {
      var styleObj;
      var id = helper.modal.addLayer.fill({
        type: "background"
      })

      styleObj = helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      const elem = $(wd.$("layer-list-item:"+id+":toggle-visibility", ""));
      elem.click();

      styleObj = helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": "background",
          "layout": {
            "visibility": "none"
          }
        },
      ]);

      elem.click();

      styleObj = helper.getStyleStore(browser);
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

  describe("tooltips", function() {
  })

  describe("help", function() {
  })


  describe('background', function () {

    it("add", function() {
      var id = helper.modal.addLayer.fill({
        type: "background"
      })

      var styleObj = helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        }
      ]);
    });

    describe("modify", function() {
      function createBackground() {
        // Setup
        var id = uuid();

        const selectBox = $(wd.$("add-layer.layer-type", "select"));
        selectBox.selectByAttribute('value', "background");
        browser.flushReactUpdates();
        browser.setValueSafe(wd.$("add-layer.layer-id", "input"), "background:"+id);

        const elem = $(wd.$("add-layer"));
        elem.click();

        var styleObj = helper.getStyleStore(browser);
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
        it("id", function() {
          var bgId = createBackground();

          const elem = $(wd.$("layer-list-item:background:"+bgId));
          elem.click();

          var id = uuid();
          browser.setValueSafe(wd.$("layer-editor.layer-id", "input"), "foobar:"+id)
          const elem2 = $(wd.$("min-zoom"));
          elem2.click();

          var styleObj = helper.getStyleStore(browser);
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'foobar:'+id,
              "type": 'background'
            }
          ]);
        });

        it("min-zoom", function() {
          var bgId = createBackground();

          const elem = $(wd.$("layer-list-item:background:"+bgId));
          elem.click();
          browser.setValueSafe(wd.$("min-zoom", 'input[type="text"]'), 1)
          const elem2 = $(wd.$("layer-editor.layer-id", "input"));
          elem2.click();

          var styleObj = helper.getStyleStore(browser);
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background',
              "minzoom": 1
            }
          ]);

          // AND RESET!
          // browser.setValueSafe(wd.$("min-zoom", "input"), "")
          // browser.click(wd.$("max-zoom", "input"));

          // var styleObj = helper.getStyleStore(browser);

          // assert.deepEqual(styleObj.layers, [
          //   {
          //     "id": 'background:'+bgId,
          //     "type": 'background'
          //   }
          // ]);
        });

        it("max-zoom", function() {
          var bgId = createBackground();

          const elem = $(wd.$("layer-list-item:background:"+bgId));
          elem.click();
          browser.setValueSafe(wd.$("max-zoom", 'input[type="text"]'), 1)
          const elem2 = $(wd.$("layer-editor.layer-id", "input"));
          elem2.click();

          var styleObj = helper.getStyleStore(browser);
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background',
              "maxzoom": 1
            }
          ]);
        });

        it("comments", function() {
          var bgId = createBackground();
          var id = uuid();

          const elem = $(wd.$("layer-list-item:background:"+bgId));
          elem.click();
          browser.setValueSafe(wd.$("layer-comment", "textarea"), id);
          const elem2 = $(wd.$("layer-editor.layer-id", "input"));
          elem2.click();

          var styleObj = helper.getStyleStore(browser);
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
          // browser.setValueSafe(wd.$("layer-comment", "textarea"), "");
          // browser.click(wd.$("min-zoom", "input"));
          // browser.flushReactUpdates();

          // var styleObj = helper.getStyleStore(browser);
          // assert.deepEqual(styleObj.layers, [
          //   {
          //     "id": 'background:'+bgId,
          //     "type": 'background'
          //   }
          // ]);
        });

        it("color", null, function() {
          var bgId = createBackground();
          var id = uuid();

          browser.click(wd.$("layer-list-item:background:"+bgId));

          browser.click(wd.$("spec-field:background-color", "input"))
          // browser.debug();

          var styleObj = helper.getStyleStore(browser);
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
        it.skip("parse error", function() {
          var bgId = createBackground();
          var id = uuid();

          browser.click(wd.$("layer-list-item:background:"+bgId));

          var errorSelector = ".CodeMirror-lint-marker-error";
          assert.equal(browser.isExisting(errorSelector), false);

          browser.click(".CodeMirror")
          browser.keys("\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013 {");
          browser.waitForExist(errorSelector)

          browser.click(wd.$("layer-editor.layer-id"));
        });
      });
    })
  });

  describe('fill', function () {
    it("add", function() {
      // browser.debug();

      var id = helper.modal.addLayer.fill({
        type: "fill",
        layer: "example"
      });

      var styleObj = helper.getStyleStore(browser);
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
    it("add", function() {
      var id = helper.modal.addLayer.fill({
        type: "line",
        layer: "example"
      });

      var styleObj = helper.getStyleStore(browser);
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
    it("add", function() {
      var id = helper.modal.addLayer.fill({
        type: "symbol",
        layer: "example"
      });

      var styleObj = helper.getStyleStore(browser);
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
    it("add", function() {
      var id = helper.modal.addLayer.fill({
        type: "raster",
        layer: "raster"
      });

      var styleObj = helper.getStyleStore(browser);
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
    it("add", function() {
      var id = helper.modal.addLayer.fill({
        type: "circle",
        layer: "example"
      });

      var styleObj = helper.getStyleStore(browser);
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
    it("add", function() {
      var id = helper.modal.addLayer.fill({
        type: "fill-extrusion",
        layer: "example"
      });

      var styleObj = helper.getStyleStore(browser);
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
    it("simple", function() {
      browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
        "geojson:example"
      ]));
      browser.acceptAlert();

      helper.modal.addLayer.open();
      var aId = helper.modal.addLayer.fill({
        id: "foo",
        type: "background"
      })

      helper.modal.addLayer.open();
      var bId = helper.modal.addLayer.fill({
        id: "foo_bar",
        type: "background"
      })

      helper.modal.addLayer.open();
      var bId = helper.modal.addLayer.fill({
        id: "foo_bar_baz",
        type: "background"
      })

      const groupEl = $(wd.$("layer-list-group:foo-0"));
      groupEl.isDisplayed();

      assert.equal($(wd.$("layer-list-item:foo")).isDisplayedInViewport(), true);
      assert.equal($(wd.$("layer-list-item:foo_bar")).isDisplayedInViewport(), false);
      assert.equal($(wd.$("layer-list-item:foo_bar_baz")).isDisplayedInViewport(), false);

      groupEl.click();

      assert.equal($(wd.$("layer-list-item:foo")).isDisplayedInViewport(), true);
      assert.equal($(wd.$("layer-list-item:foo_bar")).isDisplayedInViewport(), true);
      assert.equal($(wd.$("layer-list-item:foo_bar_baz")).isDisplayedInViewport(), true);
    })
  })
});
