var assert = require('assert');
var fs     = require("fs");
var wd     = require("../../wd-helper");
var config = require("../../config/specs");
var helper = require("../helper");


function closeModal(wdKey) {
  const selector = wd.$(wdKey);

  browser.waitUntil(function() {
    const elem = $(selector);
    return elem.isDisplayedInViewport();
  });

  const closeBtnSelector = $(wd.$(wdKey+".close-modal"));
  closeBtnSelector.click();

  browser.waitUntil(function() {
    return browser.execute((selector) => {
      return !document.querySelector(selector);
    }, selector);
  });
}

describe("modals", function() {
  describe("open", function() {
    var styleFilePath = __dirname+"/../../example-style.json";
    var styleFileData = JSON.parse(fs.readFileSync(styleFilePath));

    beforeEach(function() {
      browser.url(config.baseUrl+"?debug");

      const elem = $(".maputnik-toolbar-link");
      elem.waitForExist();
      browser.flushReactUpdates();

      const elem2 = $(wd.$("nav:open"));
      elem2.click();
      browser.flushReactUpdates();
    });

    it("close", function() {
      closeModal("modal:open");
    });

    // "chooseFile" command currently not available for wdio v5 https://github.com/webdriverio/webdriverio/pull/3632
    it.skip("upload", function() {
      const elem = $("*[type='file']");
      elem.waitForExist();
      browser.chooseFile("*[type='file']", styleFilePath);

      var styleObj = helper.getStyleStore(browser);
      assert.deepEqual(styleFileData, styleObj);
    });

    it("load from url", function() {
      var styleFileUrl  = helper.getGeoServerUrl("example-style.json");

      browser.setValueSafe(wd.$("modal:open.url.input"), styleFileUrl);

      const selector = $(wd.$("modal:open.url.button"));
      selector.click();

      // Allow the network request to happen
      // NOTE: Its localhost so this should be fast.
      browser.pause(300);

      var styleObj = helper.getStyleStore(browser);
      assert.deepEqual(styleFileData, styleObj);
    });

    // TODO: Need to work out how to mock out the end points
    it("gallery")
  })

  describe("shortcuts", function() {
    it("open/close", function() {
      browser.url(config.baseUrl+"?debug");

      const elem = $(".maputnik-toolbar-link");
      elem.waitForExist();
      browser.flushReactUpdates();

      browser.keys(["?"]);

      const modalEl = $(wd.$("modal:shortcuts"))
      assert(modalEl.isDisplayed());

      closeModal("modal:shortcuts");
    });

  });

  describe("export", function() {

    beforeEach(function() {
      browser.url(config.baseUrl+"?debug");

      const elem = $(".maputnik-toolbar-link");
      elem.waitForExist();
      browser.flushReactUpdates();

      const elem2 = $(wd.$("nav:export"));
      elem2.click();
      browser.flushReactUpdates();
    });

    it("close", function() {
      closeModal("modal:export");
    });

    // TODO: Work out how to download a file and check the contents
    it("download")

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
      browser.acceptAlert();

      const selectBox = $(wd.$("nav:inspect", "select"));
      selectBox.selectByAttribute('value', "inspect");
    })
  })

  describe("style settings", function() {
    beforeEach(function() {
      browser.url(config.baseUrl+"?debug");

      const elem = $(".maputnik-toolbar-link");
      elem.waitForExist();
      browser.flushReactUpdates();

      const elem2 = $(wd.$("nav:settings"));
      elem2.click();
      browser.flushReactUpdates();
    });

    it("name", function() {
      browser.setValueSafe(wd.$("modal:settings.name"), "foobar")
      const elem = $(wd.$("modal:settings.owner"));
      elem.click();
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.name, "foobar");
    })
    it("owner", function() {
      browser.setValueSafe(wd.$("modal:settings.owner"), "foobar")
      const elem = $(wd.$("modal:settings.name"));
      elem.click();
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.owner, "foobar");
    })
    it("sprite url", function() {
      browser.setValueSafe(wd.$("modal:settings.sprite"), "http://example.com")
      const elem = $(wd.$("modal:settings.name"));
      elem.click();
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.sprite, "http://example.com");
    })
    it("glyphs url", function() {
      var glyphsUrl = "http://example.com/{fontstack}/{range}.pbf"
      browser.setValueSafe(wd.$("modal:settings.glyphs"), glyphsUrl)
      const elem = $(wd.$("modal:settings.name"));
      elem.click();
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.glyphs, glyphsUrl);
    })

    it("mapbox access token", function() {
      var apiKey = "testing123";
      browser.setValueSafe(wd.$("modal:settings.maputnik:mapbox_access_token"), apiKey);
      const elem = $(wd.$("modal:settings.name"));
      elem.click();
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      browser.waitUntil(function() {
        return styleObj.metadata["maputnik:mapbox_access_token"] == apiKey;
      })
    })

    it("maptiler access token", function() {
      var apiKey = "testing123";
      browser.setValueSafe(wd.$("modal:settings.maputnik:openmaptiles_access_token"), apiKey);
      const elem = $(wd.$("modal:settings.name"));
      elem.click();
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.metadata["maputnik:openmaptiles_access_token"], apiKey);
    })

    it("thunderforest access token", function() {
      var apiKey = "testing123";
      browser.setValueSafe(wd.$("modal:settings.maputnik:thunderforest_access_token"), apiKey);
      const elem = $(wd.$("modal:settings.name"));
      elem.click();
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.metadata["maputnik:thunderforest_access_token"], apiKey);
    })

    it("style renderer", function() {
      const selector = $(wd.$("modal:settings.maputnik:renderer"));
      selector.selectByAttribute('value', "ol");
      const elem = $(wd.$("modal:settings.name"));
      elem.click();
      browser.flushReactUpdates();

      var styleObj = helper.getStyleStore(browser);
      assert.equal(styleObj.metadata["maputnik:renderer"], "ol");
    })
  })

  describe("sources", function() {
    it("toggle")
  })
})
