var assert = require('assert');
var fs     = require("fs");
var wd     = require("../../wd-helper");
var config = require("../../config/specs");
var helper = require("../helper");


function closeModal(wdKey) {
  browser.waitUntil(function() {
    return browser.isVisibleWithinViewport(wd.$(wdKey));
  });

  var closeBtnSelector = wd.$(wdKey+".close-modal");
  browser.click(closeBtnSelector);

  browser.waitUntil(function() {
    return !browser.isVisibleWithinViewport(wd.$(wdKey));
  });
}

describe("modals", function() {
  describe("open", function() {
    var styleFilePath = __dirname+"/../../example-style.json";
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

      var styleObj = helper.getStyleStore(browser);
      assert.deepEqual(styleFileData, styleObj);
    });

    it("load from url", function() {
      var styleFileUrl  = helper.getGeoServerUrl("example-style.json");

      browser.setValueSafe(wd.$("open-modal.url.input"), styleFileUrl);

      var selector = wd.$("open-modal.url.button");
      browser.click(selector);

      // Allow the network request to happen
      // NOTE: Its localhost so this should be fast.
      browser.pause(300);

      var styleObj = helper.getStyleStore(browser);
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
      browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
        "geojson:example"
      ]));

      browser.selectByValue(wd.$("nav:inspect", "select"), "inspect");
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

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.name, "foobar");
    })
    it("owner", function() {
      browser.setValueSafe(wd.$("modal-settings.owner"), "foobar")
      browser.click(wd.$("modal-settings.name"))
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.owner, "foobar");
    })
    it("sprite url", function() {
      browser.setValueSafe(wd.$("modal-settings.sprite"), "http://example.com")
      browser.click(wd.$("modal-settings.name"))
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.sprite, "http://example.com");
    })
    it("glyphs url", function() {
      var glyphsUrl = "http://example.com/{fontstack}/{range}.pbf"
      browser.setValueSafe(wd.$("modal-settings.glyphs"), glyphsUrl)
      browser.click(wd.$("modal-settings.name"))
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.glyphs, glyphsUrl);
    })

    it("mapbox access token", function() {
      var apiKey = "testing123";
      browser.setValueSafe(wd.$("modal-settings.maputnik:mapbox_access_token"), apiKey);
      browser.click(wd.$("modal-settings.name"))
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      browser.waitUntil(function() {
        return styleObj.metadata["maputnik:mapbox_access_token"] == apiKey;
      })
    })

    it("maptiler access token", function() {
      var apiKey = "testing123";
      browser.setValueSafe(wd.$("modal-settings.maputnik:openmaptiles_access_token"), apiKey);
      browser.click(wd.$("modal-settings.name"))
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.metadata["maputnik:openmaptiles_access_token"], apiKey);
    })

    it("thunderforest access token", function() {
      var apiKey = "testing123";
      browser.setValueSafe(wd.$("modal-settings.maputnik:thunderforest_access_token"), apiKey);
      browser.click(wd.$("modal-settings.name"))
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.metadata["maputnik:thunderforest_access_token"], apiKey);
    })

    it("style renderer", function() {
      var selector = wd.$("modal-settings.maputnik:renderer");
      browser.selectByValue(selector, "ol");
      browser.click(wd.$("modal-settings.name"))
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.metadata["maputnik:renderer"], "ol");
    })
  })

  describe("sources", function() {
    it("toggle")
  })
})
