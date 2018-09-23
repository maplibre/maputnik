var config    = require("../../config/specs");
var helper    = require("../helper");
var wd        = require("../../wd-helper");


// These will get used in the marketing material. They are also useful to do a quick manual check of the styling across browsers
// NOTE: These duplicate some of the tests, however this is indended becuase it's likely these will change for aesthetic reasons over time
describe('screenshots', function() {

  beforeEach(function() {
    browser.windowHandleSize({
      width: 1280,
      height: 800
    });
  })

  it("front_page", function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.waitForExist(".maputnik-toolbar-link");
    browser.flushReactUpdates();

    browser.takeScreenShot("/front_page.png")
  })

  it("open", function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.waitForExist(".maputnik-toolbar-link");
    browser.flushReactUpdates();

    browser.click(wd.$("nav:open"))
    browser.flushReactUpdates();

    browser.takeScreenShot("/open.png")
  })

  it("export", function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.waitForExist(".maputnik-toolbar-link");
    browser.flushReactUpdates();

    browser.click(wd.$("nav:export"))
    browser.flushReactUpdates();

    browser.takeScreenShot("/export.png")
  })

  it("sources", function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.waitForExist(".maputnik-toolbar-link");
    browser.flushReactUpdates();

    browser.click(wd.$("nav:sources"))
    browser.flushReactUpdates();

    browser.takeScreenShot("/sources.png")
  })

  it("style settings", function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.waitForExist(".maputnik-toolbar-link");
    browser.flushReactUpdates();

    browser.click(wd.$("nav:settings"))
    browser.flushReactUpdates();

    browser.takeScreenShot("/settings.png")
  })

  it("inspect", function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.waitForExist(".maputnik-toolbar-link");
    browser.flushReactUpdates();

    browser.click(wd.$("nav:inspect"))
    browser.flushReactUpdates();

    browser.takeScreenShot("/inspect.png")
  })
})

