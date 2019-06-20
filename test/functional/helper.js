var wd = require("../wd-helper");
var uuid = require('uuid/v1');
var geoServer = require("../geojson-server");


var geoserver = geoServer.listen(9002);

module.exports = {
  getStyleUrl: function(styles) {
    var port = geoserver.address().port;
    return "http://localhost:"+port+"/styles/empty/"+styles.join(",");
  },
  getGeoServerUrl: function(urlPath) {
    var port = geoserver.address().port;
    return "http://localhost:"+port+"/"+urlPath;
  },
  getStyleStore: function(browser) {
    var result = browser.executeAsync(function(done) {
      window.debug.get("maputnik", "styleStore").latestStyle(done);
    })
    return result;
  },
  getRevisionStore: function(browser) {
    var result = browser.execute(function(done) {
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
      open: function() {
        const selector = $(wd.$('layer-list:add-layer'));
        selector.click();

        // Wait for events
        browser.flushReactUpdates();

        const elem = $(wd.$('modal:add-layer'));
        elem.waitForExist();
        elem.isDisplayed();
        elem.isDisplayedInViewport();

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

        const selectBox = $(wd.$("add-layer.layer-type", "select"));
        selectBox.selectByAttribute('value', type);
        browser.flushReactUpdates();

        browser.setValueSafe(wd.$("add-layer.layer-id", "input"), id);
        if(layer) {
          browser.setValueSafe(wd.$("add-layer.layer-source-block", "input"), layer);
        }

        browser.flushReactUpdates();
        const elem_addLayer = $(wd.$("add-layer"));
        elem_addLayer.click();

        return id;
      }
    }
  }
}

