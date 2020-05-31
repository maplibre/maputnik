var config      = require("../config/specs");
var helper      = require("./helper");


describe('maputnik', function() {

  before(function(done) {
    require("./util/webdriverio-ext");
    helper.startGeoserver(done);
  });

  after(function(done) {
    helper.stopGeoserver(done);
  });

  beforeEach(function() {
    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example",
      "raster:raster"
    ]));
    browser.acceptAlert();
    browser.execute(function() {
      localStorage.setItem("survey", true);
    });
    const elem = $(".maputnik-toolbar-link");
    elem.waitForExist();
    browser.flushReactUpdates();
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

