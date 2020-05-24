var config    = require("../../config/specs");
var helper    = require("../helper");
var wd        = require("../../wd-helper");


// These will get used in the marketing material. They are also useful to do a quick manual check of the styling across browsers
// NOTE: These duplicate some of the tests, however this is indended becuase it's likely these will change for aesthetic reasons over time
describe('screenshots', function() {

  beforeEach(function() {
    browser.setWindowSize(1280, 800)
  })

  it("front_page", function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.acceptAlert();
    const elem = $(".maputnik-toolbar-link");
    elem.waitForExist();  
    browser.flushReactUpdates();

    browser.takeScreenShot("/front_page.png")
  })

  it("open", function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.acceptAlert();
    const elem = $(".maputnik-toolbar-link");
    elem.waitForExist();  
    browser.flushReactUpdates();

    const nav_open = $(wd.$("nav:open"));
    nav_open.click();
    nav_open.waitForExist(); 
    browser.flushReactUpdates();

    browser.takeScreenShot("/open.png")
  })

  it("export", function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.acceptAlert();
    const elem = $(".maputnik-toolbar-link")
    elem.waitForExist()  
    browser.flushReactUpdates();

    const nav_export = $(wd.$("nav:export"));
    nav_export.click();
    nav_export.waitForExist(); 
    browser.flushReactUpdates();

    browser.takeScreenShot("/export.png")
  })

  it("sources", function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.acceptAlert();
    const elem = $(".maputnik-toolbar-link")
    elem.waitForExist()  
    browser.flushReactUpdates();

    const nav_sources = $(wd.$("nav:sources"));
    nav_sources.click();
    nav_sources.waitForExist(); 
    browser.flushReactUpdates();

    browser.takeScreenShot("/sources.png")
  })

  it("style settings", function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.acceptAlert();
    const elem = $(".maputnik-toolbar-link")
    elem.waitForExist()  
    browser.flushReactUpdates();

    const nav_settings = $(wd.$("nav:settings"));
    nav_settings.click();
    nav_settings.waitForExist(); 
    browser.flushReactUpdates();

    browser.takeScreenShot("/settings.png")
  })

  it("inspect", function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.acceptAlert();
    const elem = $(".maputnik-toolbar-link")
    elem.waitForExist()  
    browser.flushReactUpdates();

    const selectBox = $(wd.$("nav:inspect", "select"));
    selectBox.selectByAttribute('value', 'inspect');

    browser.flushReactUpdates();

    browser.takeScreenShot("/inspect.png")
  })
})

