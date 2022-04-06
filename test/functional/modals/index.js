var assert = require('assert');
var fs     = require("fs");
var wd     = require("../../wd-helper");
var config = require("../../config/specs");
var helper = require("../helper");


async function closeModal(wdKey) {
  const selector = wd.$(wdKey);

  await browser.waitUntil(async function() {
    const elem = await $(selector);
    return await elem.isDisplayedInViewport();
  });

  const closeBtnSelector = await $(wd.$(wdKey+".close-modal"));
  await closeBtnSelector.click();

  await browser.waitUntil(async function() {
    return await browser.execute((selector) => {
      return !document.querySelector(selector);
    }, selector);
  });
}

describe("modals", function() {
  describe("open", function() {
    var styleFilePath = __dirname+"/../../example-style.json";
    var styleFileData = JSON.parse(fs.readFileSync(styleFilePath));

    beforeEach(async function() {
      await browser.url(config.baseUrl+"?debug");

      const elem = await $(".maputnik-toolbar-link");
      await elem.waitForExist();
      await browser.flushReactUpdates();

      const elem2 = await $(wd.$("nav:open"));
      await elem2.click();
      await browser.flushReactUpdates();
    });

    it("close", async function() {
      await closeModal("modal:open");
    });

    // "chooseFile" command currently not available for wdio v5 https://github.com/webdriverio/webdriverio/pull/3632
    it.skip("upload", async function() {
      const elem = await $("*[type='file']");
      await elem.waitForExist();
      await browser.chooseFile("*[type='file']", styleFilePath);

      var styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleFileData, styleObj);
    });

    it("load from url", async function() {
      var styleFileUrl  = helper.getGeoServerUrl("example-style.json");

      await browser.setValueSafe(wd.$("modal:open.url.input"), styleFileUrl);

      const selector = await $(wd.$("modal:open.url.button"));
      await selector.click();

      // Allow the network request to happen
      // NOTE: Its localhost so this should be fast.
      await browser.pause(300);

      var styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleFileData, styleObj);
    });

    // TODO: Need to work out how to mock out the end points
    it("gallery")
  })

  describe("shortcuts", function() {
    it("open/close", async function() {
      await browser.url(config.baseUrl+"?debug");

      const elem = await $(".maputnik-toolbar-link");
      await elem.waitForExist();
      await browser.flushReactUpdates();

      await browser.keys(["?"]);

      const modalEl = await $(wd.$("modal:shortcuts"))
      assert(await modalEl.isDisplayed());

      await closeModal("modal:shortcuts");
    });

  });

  describe("export", function() {

    beforeEach(async function() {
      await browser.url(config.baseUrl+"?debug");

      const elem = await $(".maputnik-toolbar-link");
      await elem.waitForExist();
      await browser.flushReactUpdates();

      const elem2 = await $(wd.$("nav:export"));
      await elem2.click();
      await browser.flushReactUpdates();
    });

    it("close", async function() {
      await closeModal("modal:export");
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
    it("toggle", async function() {
      await browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
        "geojson:example"
      ]));
      await browser.acceptAlert();

      const selectBox = await $(wd.$("nav:inspect", "select"));
      await selectBox.selectByAttribute('value', "inspect");
    })
  })

  describe("style settings", function() {
    beforeEach(async function() {
      await browser.url(config.baseUrl+"?debug");

      const elem = await $(".maputnik-toolbar-link");
      await elem.waitForExist();
      await browser.flushReactUpdates();

      const elem2 = await $(wd.$("nav:settings"));
      await elem2.click();
      await browser.flushReactUpdates();
    });

    it("name", async function() {
      await browser.setValueSafe(wd.$("modal:settings.name"), "foobar")
      const elem = await $(wd.$("modal:settings.owner"));
      await elem.click();
      await browser.flushReactUpdates();

      var styleObj = await helper.getStyleStore(browser);
      assert.equal(styleObj.name, "foobar");
    })
    it("owner", async function() {
      await browser.setValueSafe(wd.$("modal:settings.owner"), "foobar")
      const elem = await $(wd.$("modal:settings.name"));
      await elem.click();
      await browser.flushReactUpdates();

      var styleObj = await helper.getStyleStore(browser);
      assert.equal(styleObj.owner, "foobar");
    })
    it("sprite url", async function() {
      await browser.setValueSafe(wd.$("modal:settings.sprite"), "http://example.com")
      const elem = await $(wd.$("modal:settings.name"));
      await elem.click();
      await browser.flushReactUpdates();

      var styleObj = await helper.getStyleStore(browser);
      assert.equal(styleObj.sprite, "http://example.com");
    })
    it("glyphs url", async function() {
      var glyphsUrl = "http://example.com/{fontstack}/{range}.pbf"
      await browser.setValueSafe(wd.$("modal:settings.glyphs"), glyphsUrl)
      const elem = await $(wd.$("modal:settings.name"));
      await elem.click();
      await browser.flushReactUpdates();

      var styleObj = await helper.getStyleStore(browser);
      assert.equal(styleObj.glyphs, glyphsUrl);
    })

    it("mapbox access token", async function() {
      var apiKey = "testing123";
      await browser.setValueSafe(wd.$("modal:settings.maputnik:mapbox_access_token"), apiKey);
      const elem = await $(wd.$("modal:settings.name"));
      await elem.click();
      await browser.flushReactUpdates();

      var styleObj = await helper.getStyleStore(browser);
      await browser.waitUntil(function() {
        return styleObj.metadata["maputnik:mapbox_access_token"] == apiKey;
      })
    })

    it("maptiler access token", async function() {
      var apiKey = "testing123";
      await browser.setValueSafe(wd.$("modal:settings.maputnik:openmaptiles_access_token"), apiKey);
      const elem = await $(wd.$("modal:settings.name"));
      await elem.click();
      await browser.flushReactUpdates();

      var styleObj = await helper.getStyleStore(browser);
      assert.equal(styleObj.metadata["maputnik:openmaptiles_access_token"], apiKey);
    })

    it("thunderforest access token", async function() {
      var apiKey = "testing123";
      await browser.setValueSafe(wd.$("modal:settings.maputnik:thunderforest_access_token"), apiKey);
      const elem = await $(wd.$("modal:settings.name"));
      await elem.click();
      await browser.flushReactUpdates();

      var styleObj = await helper.getStyleStore(browser);
      assert.equal(styleObj.metadata["maputnik:thunderforest_access_token"], apiKey);
    })

    it("style renderer", async function() {
      const selector = await $(wd.$("modal:settings.maputnik:renderer"));
      await selector.selectByAttribute('value', "ol");
      const elem = await $(wd.$("modal:settings.name"));
      await elem.click();
      await browser.flushReactUpdates();

      var styleObj = await helper.getStyleStore(browser);
      assert.equal(styleObj.metadata["maputnik:renderer"], "ol");
    })
  })

  describe("sources", function() {
    it("toggle")
  })
})
