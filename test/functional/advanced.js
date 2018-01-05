var assert    = require('assert');
var config    = require("../config/specs");
var uuid      = require('uuid/v1');
var geoServer = require("../geojson-server");
var wd        = require("../wd-helper");
var fs        = require("fs");
var path      = require("path");
var mkdirp    = require("mkdirp");
var artifacts = require("../artifacts");
var istanbulCov = require('istanbul-lib-coverage');

var COVERAGE_PATH = artifacts.pathSync("/coverage");
var SCREENSHOTS_PATH = artifacts.pathSync("/screenshots");


browser.timeoutsAsyncScript(10*1000);
browser.timeoutsImplicitWait(10*1000);



var modelCommands = {
  addLayer: {
    open: function() {
      var selector = wd.$('layer-list:add-layer');
      browser.click(selector);

      // Wait for events
      browser.flushReactUpdates();

      browser.waitForExist(wd.$('modal:add-layer'));
      browser.isVisible(wd.$('modal:add-layer'));
      browser.isVisibleWithinViewport(wd.$('modal:add-layer'));

      // Wait for events
      browser.flushReactUpdates();
    },
    fill: function(opts) {
      var type = opts.type;
      var layer = opts.layer;
      var id;
      if(opts.id) {
        id = opts.id
      }
      else {
        id = type+":"+uuid();
      }

      browser.selectByValue(wd.$("add-layer.layer-type", "select"), type);
      browser.flushReactUpdates();

      browser.setValueSafe(wd.$("add-layer.layer-id", "input"), id);
      if(layer) {
        browser.setValueSafe(wd.$("add-layer.layer-source-block", "input"), layer);
      }

      browser.flushReactUpdates();
      browser.click(wd.$("add-layer"));

      return id;
    }
  }
}

/**
 * Sometimes chrome driver can result in the wrong text.
 *
 * See <https://github.com/webdriverio/webdriverio/issues/1886>
 */
try {
browser.addCommand('setValueSafe', function(selector, text) {
  for(var i=0; i<10; i++) {
    console.log(">>>> waiting for visible");
    browser.waitForVisible(selector);

    var elements = browser.elements(selector);
    if(elements.length > 1) {
      console.error(">>> Too many elements found");
      throw "Too many elements found";
    }

    console.log(">>>> setting value");
    browser.setValue(selector, text);
    var browserText = browser.getValue(selector);

    console.log("browserText='%s' test='%s'", browserText, text);

    if(browserText == text) {
      return;
    }
    else {
      console.error("Warning: setValue failed, trying again");
    }
  }

  // Wait for change events to fire and state updated
  browser.flushReactUpdates();
})

browser.addCommand('takeScreenShot', function(filepath) {
  var data = browser.screenshot();
  fs.writeFileSync(path.join(SCREENSHOTS_PATH, filepath), data.value, 'base64');
});

browser.addCommand('flushReactUpdates', function() {
  browser.executeAsync(function(done) {
    // For any events to propogate
    setImmediate(function() {
      // For the DOM to be updated.
      setImmediate(done);
    })
  })
})

} catch(err) {
  console.error(err);
}

describe('maputnik', function() {
  var geoserver;

  before(function(done) {
    // Start style server
    geoserver = geoServer.listen(9002, done);
  });

  function getStyleStore(browser) {
    var result = browser.executeAsync(function(done) {
      window.debug.get("maputnik", "styleStore").latestStyle(done);
    })
    return result.value;
  }

  function getRevisionStore(browser) {
    var result = browser.execute(function(done) {
      var rs = window.debug.get("maputnik", "revisionStore")

      return {
        currentIdx: rs.currentIdx,
        revisions: rs.revisions
      };
    })
    return result.value;
  }

  function getStyleUrl(styles) {
    var port = geoserver.address().port;
    return "http://localhost:"+port+"/styles/empty/"+styles.join(",");
  }

  function getGeoServerUrl(urlPath) {
    var port = geoserver.address().port;
    return "http://localhost:"+port+"/"+urlPath;
  }

  beforeEach(function() {
    browser.url(config.baseUrl+"?debug&style="+getStyleUrl([
      "geojson:example",
      "raster:raster"
    ]));
    browser.waitForExist(".maputnik-toolbar-link");
    browser.flushReactUpdates();
  });

  it('check logo exists', function () {
    var src = browser.getAttribute(".maputnik-toolbar-link img", "src");
    assert.equal(src, config.baseUrl+'/img/logo-color.svg');
  });

  function closeModal(wdKey) {
    console.log(">> A");
    browser.waitUntil(function() {
      return browser.isVisibleWithinViewport(wd.$(wdKey));
    });

    console.log(">> B");
    var closeBtnSelector = wd.$(wdKey+".close-modal");
    browser.click(closeBtnSelector);

    console.log(">> C");
    browser.waitUntil(function() {
      return !browser.isVisibleWithinViewport(wd.$(wdKey));
    });
  }

  describe("modal", function() {
    describe("open", function() {
      var styleFilePath = __dirname+"/../example-style.json";
      var styleFileData = JSON.parse(fs.readFileSync(styleFilePath));

      beforeEach(function() {
        browser.url(config.baseUrl+"?debug");

        browser.waitForExist(".maputnik-toolbar-link");
        browser.flushReactUpdates();

        browser.click(wd.$("nav:open"))
        browser.flushReactUpdates();
      });

      it("close", function() {
        closeModal("open-modal");
      });

      it("upload", function() {
        browser.waitForExist("*[type='file']")
        browser.chooseFile("*[type='file']", styleFilePath);

        var styleObj = getStyleStore(browser);
        console.log("styleObj", styleObj);
        assert.deepEqual(styleFileData, styleObj);
      });

      it("load from url", function() {
        var styleFileUrl  = getGeoServerUrl("example-style.json");

        browser.setValueSafe(wd.$("open-modal.url.input"), styleFileUrl);

        var selector = wd.$("open-modal.url.button");
        console.log("selector", selector);
        browser.click(selector);

        // Allow the network request to happen
        // NOTE: Its localhost so this should be fast.
        browser.pause(300);

        var styleObj = getStyleStore(browser);
        console.log("styleObj", styleObj);
        console.log("styleFileData", styleFileData);
        assert.deepEqual(styleFileData, styleObj);
      });

      // TODO: Need to work out how to mock out the end points
      it("gallery")
    })

    describe("export", function() {

      beforeEach(function() {
        browser.url(config.baseUrl+"?debug");

        browser.waitForExist(".maputnik-toolbar-link");
        browser.flushReactUpdates();

        browser.click(wd.$("nav:export"))
        browser.flushReactUpdates();
      });

      it("close", function() {
        closeModal("export-modal");
      });

      // TODO: Work out how to download a file and check the contents
      it("download")
      // TODO: Work out how to mock the end git points
      it("save to gist")
    })

    describe("sources", function() {
      it("active sources")
      it("public source")
      it("add new source")
    })

    describe("inspect", function() {
      it("toggle", function() {
        browser.url(config.baseUrl+"?debug&style="+getStyleUrl([
          "geojson:example"
        ]));

        browser.click(wd.$("nav:inspect"));
      })
    })

    describe("style settings", function() {
      beforeEach(function() {
        browser.url(config.baseUrl+"?debug");

        browser.waitForExist(".maputnik-toolbar-link");
        browser.flushReactUpdates();

        browser.click(wd.$("nav:settings"))
        browser.flushReactUpdates();
      });

      it("name", function() {
        browser.setValueSafe(wd.$("modal-settings.name"), "foobar")
        browser.click(wd.$("modal-settings.owner"))
        browser.flushReactUpdates();

        var styleObj = getStyleStore(browser);
        console.log("styleObj", styleObj);
        assert.equal(styleObj.name, "foobar");
      })
      it("owner", function() {
        browser.setValueSafe(wd.$("modal-settings.owner"), "foobar")
        browser.click(wd.$("modal-settings.name"))
        browser.flushReactUpdates();

        var styleObj = getStyleStore(browser);
        console.log("styleObj", styleObj);
        assert.equal(styleObj.owner, "foobar");
      })
      it("sprite url", function() {
        browser.setValueSafe(wd.$("modal-settings.sprite"), "http://example.com")
        browser.click(wd.$("modal-settings.name"))
        browser.flushReactUpdates();

        var styleObj = getStyleStore(browser);
        console.log("styleObj", styleObj);
        assert.equal(styleObj.sprite, "http://example.com");
      })
      it("glyphs url", function() {
        var glyphsUrl = "http://example.com/{fontstack}/{range}.pbf"
        browser.setValueSafe(wd.$("modal-settings.glyphs"), glyphsUrl)
        browser.click(wd.$("modal-settings.name"))
        browser.flushReactUpdates();

        var styleObj = getStyleStore(browser);
        console.log("styleObj", styleObj);
        assert.equal(styleObj.glyphs, glyphsUrl);
      })

      it("mapbox access token", function() {
        var apiKey = "testing123";
        browser.setValueSafe(wd.$("modal-settings.maputnik:mapbox_access_token"), apiKey);
        browser.click(wd.$("modal-settings.name"))
        browser.flushReactUpdates();

        var styleObj = getStyleStore(browser);
        console.log("styleObj", styleObj);
        browser.waitUntil(function() {
          return styleObj.metadata["maputnik:mapbox_access_token"] == apiKey;
        })
      })

      it("open map tiles access token", function() {
        var apiKey = "testing123";
        browser.setValueSafe(wd.$("modal-settings.maputnik:openmaptiles_access_token"), apiKey);
        browser.click(wd.$("modal-settings.name"))
        browser.flushReactUpdates();

        var styleObj = getStyleStore(browser);
        console.log("styleObj", styleObj);
        assert.equal(styleObj.metadata["maputnik:openmaptiles_access_token"], apiKey);
      })

      it("style renderer", function() {
        var selector = wd.$("modal-settings.maputnik:renderer");
        browser.selectByValue(selector, "ol3");
        browser.click(wd.$("modal-settings.name"))
        browser.flushReactUpdates();

        var styleObj = getStyleStore(browser);
        console.log("styleObj", styleObj);
        assert.equal(styleObj.metadata["maputnik:renderer"], "ol3");
      })
    })

    describe("sources", function() {
      it("toggle")
    })
  })

  describe.skip("zoom level", function() {
    it("via url", function() {
      var zoomLevel = "12.37"
      browser.url(config.baseUrl+"?debug&style="+getStyleUrl([
        "geojson:example"
      ])+"#"+zoomLevel+"/41.3805/2.1635");

      browser.waitUntil(function () {
        return (
          browser.isVisible(".mapboxgl-ctrl-zoom")
          && browser.getText(".mapboxgl-ctrl-zoom") === "Zoom level: "+(zoomLevel)
        );
      }, 10*1000)
    })
    it("via map controls", function() {
      var zoomLevel = 12.37;
      browser.url(config.baseUrl+"?debug&style="+getStyleUrl([
        "geojson:example"
      ])+"#"+zoomLevel+"/41.3805/2.1635");

      browser.click(".mapboxgl-ctrl-zoom-in")
      browser.waitUntil(function () {
        var text = browser.getText(".mapboxgl-ctrl-zoom")
        return text === "Zoom level: "+(zoomLevel+1);
      }, 10*1000)
    })
  })

  describe.skip("groups", function() {
    it("simple", function() {
      browser.url(config.baseUrl+"?debug&style="+getStyleUrl([
        "geojson:example"
      ]));

      modelCommands.addLayer.open();
      var aId = modelCommands.addLayer.fill({
        id: "foo",
        type: "background"
      })

      modelCommands.addLayer.open();
      var bId = modelCommands.addLayer.fill({
        id: "foo_bar",
        type: "background"
      })

      modelCommands.addLayer.open();
      var bId = modelCommands.addLayer.fill({
        id: "foo_baz",
        type: "background"
      })

      browser.waitForExist(wd.$("layer-list-group:foo-0"));

      assert.equal(browser.isVisibleWithinViewport(wd.$("layer-list-item:foo")), false);
      assert.equal(browser.isVisibleWithinViewport(wd.$("layer-list-item:foo_bar")), false);
      assert.equal(browser.isVisibleWithinViewport(wd.$("layer-list-item:foo_baz")), false);

      browser.click(wd.$("layer-list-group:foo-0"));

      assert.equal(browser.isVisibleWithinViewport(wd.$("layer-list-item:foo")), true);
      assert.equal(browser.isVisibleWithinViewport(wd.$("layer-list-item:foo_bar")), true);
      assert.equal(browser.isVisibleWithinViewport(wd.$("layer-list-item:foo_baz")), true);
    })
  })

  describe.skip("history", function() {
    /**
     * See <https://github.com/webdriverio/webdriverio/issues/1126>
     */
    it("undo/redo", function() {
      var styleObj;

      browser.url(config.baseUrl+"?debug&style="+getStyleUrl([
        "geojson:example"
      ]));

      modelCommands.addLayer.open();

      styleObj = getStyleStore(browser);
      assert.deepEqual(styleObj.layers, []);

      modelCommands.addLayer.fill({
        id: "step 1",
        type: "background"
      })

      styleObj = getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": "step 1",
          "type": 'background'
        }
      ]);

      modelCommands.addLayer.open();
      modelCommands.addLayer.fill({
        id: "step 2",
        type: "background"
      })

      styleObj = getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": "step 1",
          "type": 'background'
        },
        {
          "id": "step 2",
          "type": 'background'
        }
      ]);

      console.log(">>> LOGS", JSON.stringify(browser.log("browser"), null, 2))

      browser
        .keys(['Control', 'z'])
        .keys(['Control']);
      styleObj = getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": "step 1",
          "type": 'background'
        }
      ]);

      console.log(">>> LOGS", JSON.stringify(browser.log("browser"), null, 2))

      browser
        .keys(['Control', 'z'])
        .keys(['Control']);
      styleObj = getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
      ]);

      console.log(">>> LOGS", JSON.stringify(browser.log("browser"), null, 2))

      browser
        .keys(['Control', 'y'])
        .keys(['Control']);
      styleObj = getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": "step 1",
          "type": 'background'
        }
      ]);

      console.log(">>> LOGS", JSON.stringify(browser.log("browser"), null, 2))

      browser
        .keys(['Control', 'y'])
        .keys(['Control']);
      styleObj = getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": "step 1",
          "type": 'background'
        },
        {
          "id": "step 2",
          "type": 'background'
        }
      ]);

      console.log(">>> LOGS", JSON.stringify(browser.log("browser"), null, 2))
    });
  })

  describe("layers", function() {
    beforeEach(function() {
      modelCommands.addLayer.open();
    });

    describe("ops", function() {
      it("delete", function() {
        var styleObj;
        var id = modelCommands.addLayer.fill({
          type: "background"
        })

        styleObj = getStyleStore(browser);
        assert.deepEqual(styleObj.layers, [
          {
            "id": id,
            "type": 'background'
          },
        ]);

        browser.click(wd.$("layer-list-item:"+id+":delete", ""));

        styleObj = getStyleStore(browser);
        assert.deepEqual(styleObj.layers, [
        ]);
      });

      it("duplicate", function() {
        var styleObj;
        var id = modelCommands.addLayer.fill({
          type: "background"
        })

        styleObj = getStyleStore(browser);
        assert.deepEqual(styleObj.layers, [
          {
            "id": id,
            "type": 'background'
          },
        ]);

        browser.click(wd.$("layer-list-item:"+id+":copy", ""));

        styleObj = getStyleStore(browser);
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
        var id = modelCommands.addLayer.fill({
          type: "background"
        })

        styleObj = getStyleStore(browser);
        assert.deepEqual(styleObj.layers, [
          {
            "id": id,
            "type": 'background'
          },
        ]);

        browser.click(wd.$("layer-list-item:"+id+":toggle-visibility", ""));

        styleObj = getStyleStore(browser);
        assert.deepEqual(styleObj.layers, [
          {
            "id": id,
            "type": "background",
            "layout": {
              "visibility": "none"
            }
          },
        ]);

        browser.click(wd.$("layer-list-item:"+id+":toggle-visibility", ""));

        styleObj = getStyleStore(browser);
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

    describe("grouped", function() {
      it("with underscore")
      it("no without underscore")
      it("double underscore only grouped once")
    })

    describe("tooltips", function() {
    })

    describe("help", function() {
    })


    describe('background', function () {

      it.skip("add", function() {
        var id = modelCommands.addLayer.fill({
          type: "background"
        })

        browser.waitUntil(function() {
          var styleObj = getStyleStore(browser);
          assert.deepEqual(styleObj.layers, [
            {
              "id": id,
              "type": 'background'
            }
          ]);
        });
      });

      describe("modify", function() {
        function createBackground() {
          // Setup
          var id = uuid();

          browser.selectByValue(wd.$("add-layer.layer-type", "select"), "background");
          browser.flushReactUpdates();
          browser.setValueSafe(wd.$("add-layer.layer-id", "input"), "background:"+id);

          browser.click(wd.$("add-layer"));

          var styleObj = getStyleStore(browser);
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

            browser.click(wd.$("layer-list-item:background:"+bgId))

            var id = uuid();
            browser.setValueSafe(wd.$("layer-editor.layer-id", "input"), "foobar:"+id)
            browser.click(wd.$("min-zoom"))

            var styleObj = getStyleStore(browser);
            assert.deepEqual(styleObj.layers, [
              {
                "id": 'foobar:'+id,
                "type": 'background'
              }
            ]);
          });

          // NOTE: This needs to be removed from the code
          it("type");

          it("min-zoom", function() {
            var bgId = createBackground();

            browser.click(wd.$("layer-list-item:background:"+bgId))
            browser.setValueSafe(wd.$("min-zoom", "input"), 1)
            browser.click(wd.$("layer-editor.layer-id", "input"));

            var styleObj = getStyleStore(browser);
            console.log("styleObj", styleObj);
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

            // var styleObj = getStyleStore(browser);
            // console.log("styleObj", styleObj);

            // assert.deepEqual(styleObj.layers, [
            //   {
            //     "id": 'background:'+bgId,
            //     "type": 'background'
            //   }
            // ]);
          });

          it("max-zoom", function() {
            var bgId = createBackground();

            browser.click(wd.$("layer-list-item:background:"+bgId))
            browser.setValueSafe(wd.$("max-zoom", "input"), 1)
            browser.click(wd.$("layer-editor.layer-id", "input"));

            var styleObj = getStyleStore(browser);
            console.log("styleObj", styleObj);
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

            browser.click(wd.$("layer-list-item:background:"+bgId));
            browser.setValueSafe(wd.$("layer-comment", "textarea"), id);
            browser.click(wd.$("layer-editor.layer-id", "input"));

            var styleObj = getStyleStore(browser);
            console.log("styleObj", styleObj);
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

            // var styleObj = getStyleStore(browser);
            // console.log("styleObj", styleObj);
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

            var styleObj = getStyleStore(browser);
            console.log("styleObj", styleObj);
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
      it.skip("add", function() {
        // browser.debug();

        var id = modelCommands.addLayer.fill({
          type: "fill",
          layer: "example"
        });

        var styleObj = getStyleStore(browser);
        console.log("STYLEOBJ", styleObj);
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
      it.skip("add", function() {
        var id = modelCommands.addLayer.fill({
          type: "line",
          layer: "example"
        });

        var styleObj = getStyleStore(browser);
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
      it.skip("add", function() {
        var id = modelCommands.addLayer.fill({
          type: "symbol",
          layer: "example"
        });

        var styleObj = getStyleStore(browser);
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
      it.skip("add", function() {
        var id = modelCommands.addLayer.fill({
          type: "raster",
          layer: "raster"
        });

        var styleObj = getStyleStore(browser);
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
      it.skip("add", function() {
        var id = modelCommands.addLayer.fill({
          type: "circle",
          layer: "example"
        });

        var styleObj = getStyleStore(browser);
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
      it.skip("add", function() {
        var id = modelCommands.addLayer.fill({
          type: "fill-extrusion",
          layer: "example"
        });

        var styleObj = getStyleStore(browser);
        assert.deepEqual(styleObj.layers, [
          {
            "id": id,
            "type": 'fill-extrusion',
            "source": "example"
          }
        ]);
      });
    });

    // These get used in the marketing material. They are also useful to do a quick manual check of the styling across browsers
    // NOTE: These duplicate some of the tests, however this is indended becuase it's likely these will change for aesthetic reasons over time
  });

  // describe('screenshots', function() {

  //   beforeEach(function() {
  //     browser.windowHandleSize({
  //       width: 1280,
  //       height: 800
  //     });
  //   })

  //   it("front_page", function() {
  //     browser.url(config.baseUrl+"?debug&style="+getStyleUrl([
  //       "geojson:example"
  //     ]));
  //     browser.waitForExist(".maputnik-toolbar-link");
  //     browser.flushReactUpdates();

  //     browser.takeScreenShot("/front_page.png")
  //   })

  //   it("open", function() {
  //     browser.url(config.baseUrl+"?debug&style="+getStyleUrl([
  //       "geojson:example"
  //     ]));
  //     browser.waitForExist(".maputnik-toolbar-link");
  //     browser.flushReactUpdates();

  //     browser.click(wd.$("nav:open"))
  //     browser.flushReactUpdates();

  //     browser.takeScreenShot("/open.png")
  //   })

  //   it("export", function() {
  //     browser.url(config.baseUrl+"?debug&style="+getStyleUrl([
  //       "geojson:example"
  //     ]));
  //     browser.waitForExist(".maputnik-toolbar-link");
  //     browser.flushReactUpdates();

  //     browser.click(wd.$("nav:export"))
  //     browser.flushReactUpdates();

  //     browser.takeScreenShot("/export.png")
  //   })

  //   it("sources", function() {
  //     browser.url(config.baseUrl+"?debug&style="+getStyleUrl([
  //       "geojson:example"
  //     ]));
  //     browser.waitForExist(".maputnik-toolbar-link");
  //     browser.flushReactUpdates();

  //     browser.click(wd.$("nav:sources"))
  //     browser.flushReactUpdates();

  //     browser.takeScreenShot("/sources.png")
  //   })

  //   it("style settings", function() {
  //     browser.url(config.baseUrl+"?debug&style="+getStyleUrl([
  //       "geojson:example"
  //     ]));
  //     browser.waitForExist(".maputnik-toolbar-link");
  //     browser.flushReactUpdates();

  //     browser.click(wd.$("nav:settings"))
  //     browser.flushReactUpdates();

  //     browser.takeScreenShot("/settings.png")
  //   })

  //   it("inspect", function() {
  //     browser.url(config.baseUrl+"?debug&style="+getStyleUrl([
  //       "geojson:example"
  //     ]));
  //     browser.waitForExist(".maputnik-toolbar-link");
  //     browser.flushReactUpdates();

  //     browser.click(wd.$("nav:inspect"))
  //     browser.flushReactUpdates();

  //     browser.takeScreenShot("/inspect.png")
  //   })
  // })

  var coverage = istanbulCov.createCoverageMap({});

  afterEach(function() {
    // Code coverage
    var results = browser.execute(function() {
      return window.__coverage__;
    });

    coverage.merge(results.value);
  })

  after(function() {
    var jsonStr = JSON.stringify(coverage, null, 2);
    fs.writeFileSync(COVERAGE_PATH+"/coverage.json", jsonStr);
  })

});

