var config      = require("../config/specs");
var helper      = require("./helper");
var extendWebdriverIO = require("./util/webdriverio-ext");


describe('maputnik', function() {

  before(async function(done) {
    await extendWebdriverIO();
    helper.startGeoserver(done);
  });

  after(function(done) {
    helper.stopGeoserver(done);
  });

  beforeEach(async function() {
    await browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example",
      "raster:raster"
    ]));
    await browser.acceptAlert();
    await browser.execute(function() {
      localStorage.setItem("survey", true);
    });
    const elem = await $(".maputnik-toolbar-link");
    await elem.waitForExist();
    await browser.flushReactUpdates();
  });

  // -------- setup --------
  require("./util/coverage");
  // -----------------------

  // ---- All the tests ----
  require("./history");
  require("./layers");
  require("./map");
  require("./modals");
  require("./screenshots");
  require("./accessibility");
  require("./keyboard");
  // ------------------------

});

