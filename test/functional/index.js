var driver      = require("./driver");

describe('maputnik', function() {

  before(async function(done) {
    await browser.setTimeout({ 'script': 20 * 1000 });
    await browser.setTimeout({ 'implicit': 20 * 1000 });
    driver.geoserver.start(done);
  });

  after(function(done) {
    driver.geoserver.stop(done);
  });

  beforeEach(async function() {
    await driver.setStyle(["geojson:example","raster:raster"]);
    await driver.setSurvey();
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

