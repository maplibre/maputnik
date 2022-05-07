var wd = require("../wd-helper");
var {v1: uuid} = require('uuid');
var geoServer = require("../geojson-server");

var testNetwork = process.env.TEST_NETWORK || "localhost";
var geoserver;

module.exports = {
  startGeoserver: function(done) {
    geoserver = geoServer.listen(9002, "0.0.0.0", done);
  },
  stopGeoserver: function(done) {
    geoserver.close(done);
    geoserver = undefined;
  },
  getStyleUrl: function(styles) {
    var port = geoserver.address().port;
    return "http://"+testNetwork+":"+port+"/styles/empty/"+styles.join(",");
  },
  getGeoServerUrl: function(urlPath) {
    var port = geoserver.address().port;
    return "http://"+testNetwork+":"+port+"/"+urlPath;
  },
  getStyleStore: async function(browser) {
    return await browser.executeAsync(function(done) {
      window.debug.get("maputnik", "styleStore").latestStyle(done);
    });
  },
  getRevisionStore: async function(browser) {
    var result = await browser.execute(function() {
      var rs = window.debug.get("maputnik", "revisionStore")

      return {
        currentIdx: rs.currentIdx,
        revisions: rs.revisions
      };
    })
    return result.value;
  },
  modal: {
    addLayer: {
      open: async function() {
        const selector = await $(wd.$('layer-list:add-layer'));
        await selector.click();

        // Wait for events
        await browser.flushReactUpdates();

        const elem = await $(wd.$('modal:add-layer'));
        await elem.waitForExist();
        await elem.isDisplayed();
        await elem.isDisplayedInViewport();

        // Wait for events
        await browser.flushReactUpdates();
      },
      fill: async function(opts) {
        var type = opts.type;
        var layer = opts.layer;
        var id;
        if(opts.id) {
          id = opts.id
        }
        else {
          id = type+":"+uuid();
        }

        const selectBox = await $(wd.$("add-layer.layer-type", "select"));
        await selectBox.selectByAttribute('value', type);
        await browser.flushReactUpdates();

        await browser.setValueSafe(wd.$("add-layer.layer-id", "input"), id);
        if(layer) {
          await browser.setValueSafe(wd.$("add-layer.layer-source-block", "input"), layer);
        }

        await browser.flushReactUpdates();
        const elem_addLayer = await $(wd.$("add-layer"));
        await elem_addLayer.click();

        return id;
      }
    }
  }
}

