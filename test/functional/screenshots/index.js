var config    = require("../../config/specs");
var helper    = require("../helper");
var wd        = require("../../wd-helper");


// These will get used in the marketing material. They are also useful to do a quick manual check of the styling across browsers
// NOTE: These duplicate some of the tests, however this is indended becuase it's likely these will change for aesthetic reasons over time
describe('screenshots', function() {

  beforeEach(async function() {
    await browser.setWindowSize(1280, 800)
  })

  it("front_page", async function() {
    await browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    await browser.acceptAlert();
    const elem = await $(".maputnik-toolbar-link");
    await elem.waitForExist();  
    await browser.flushReactUpdates();

    await browser.takeScreenShot("/front_page.png")
  })

  it("open", async function() {
    await browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    await browser.acceptAlert();
    const elem = await $(".maputnik-toolbar-link");
    await elem.waitForExist();  
    await browser.flushReactUpdates();

    const nav_open = await $(wd.$("nav:open"));
    await nav_open.click();
    await nav_open.waitForExist(); 
    await browser.flushReactUpdates();

    await browser.takeScreenShot("/open.png")
  })

  it("export", async function() {
    await browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    await browser.acceptAlert();
    const elem = await $(".maputnik-toolbar-link")
    await elem.waitForExist()  
    await browser.flushReactUpdates();

    const nav_export = await $(wd.$("nav:export"));
    await nav_export.click();
    await nav_export.waitForExist(); 
    await browser.flushReactUpdates();

    await browser.takeScreenShot("/export.png")
  })

  it("sources", async function() {
    await browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    await browser.acceptAlert();
    const elem = await $(".maputnik-toolbar-link")
    await elem.waitForExist()  
    await browser.flushReactUpdates();

    const nav_sources = await $(wd.$("nav:sources"));
    await nav_sources.click();
    await nav_sources.waitForExist(); 
    await browser.flushReactUpdates();

    await browser.takeScreenShot("/sources.png")
  })

  it("style settings", async function() {
    await browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    await browser.acceptAlert();
    const elem = await $(".maputnik-toolbar-link")
    await elem.waitForExist()  
    await browser.flushReactUpdates();

    const nav_settings = await $(wd.$("nav:settings"));
    await nav_settings.click();
    await nav_settings.waitForExist(); 
    await browser.flushReactUpdates();

    await browser.takeScreenShot("/settings.png")
  })

  it("inspect", async function() {
    await browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    await browser.acceptAlert();
    const elem = await $(".maputnik-toolbar-link")
    await elem.waitForExist()  
    await browser.flushReactUpdates();

    const selectBox = await $(wd.$("nav:inspect", "select"));
    await selectBox.selectByAttribute('value', 'inspect');

    await browser.flushReactUpdates();

    await browser.takeScreenShot("/inspect.png")
  })
})

