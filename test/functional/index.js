var config      = require("../config/specs");
var helper      = require("./helper");

require("./util/webdriverio-ext");


describe('maputnik', function() {

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
  // ------------------------

});

