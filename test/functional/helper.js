var wd = require("../wd-helper");
var uuid = require('uuid/v1');
var geoServer = require("../geojson-server");


// This should be sync...
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
    return result.value;
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
}

