var assert    = require('assert');
var config    = require("../config/specs");
var uuid      = require('uuid/v1');
var geoServer = require("../geojson-server");
var wd        = require("../wd-helper");
var fs        = require("fs");
var path      = require("path");
var mkdirp    = require("mkdirp");
var artifacts = require("../artifacts");

var BUILD_PATH = artifacts.pathSync("coverage");


describe('maputnik', function() {
  var geoserver;

  before(function(done) {
    // Start style server
    geoserver = geoServer.listen(9002, done);
  });

  function getStyleStore(browser) {
    var result = browser.executeAsync(function(done) {
      window.debug.get("maputnik", "styleStore").latestStyle(done);
    })
    return result.value;
  }

  function getStyleUrl(styles) {
    var port = geoserver.address().port;
    return "http://localhost:"+port+"/styles/empty/"+styles.join(",");
  }

  beforeEach(function() {
    browser.url(config.baseUrl+"?debug&style="+getStyleUrl([
      "example"
    ]));
    browser.waitForExist(".maputnik-toolbar-link");
  });

  it('check logo exists', function () {
    var src = browser.getAttribute(".maputnik-toolbar-link img", "src");
    assert.equal(src, config.baseUrl+'/img/logo-color.svg');
  });

  describe("layers", function() {
    beforeEach(function() {
      browser.click(wd.$('layer-list:add-layer'))
      browser.waitForExist(wd.$('modal:add-layer'));
      browser.isVisible(wd.$('modal:add-layer'));
      browser.isVisibleWithinViewport(wd.$('modal:add-layer'));
    });

    it('background', function () {
      var id = uuid();

      browser.waitForVisible(wd.$("layer-id", "input"));
      browser.setValue(wd.$("layer-id", "input"), "background:"+id);
      browser.selectByValue(wd.$("layer-type", "select"), "background");

      browser.click(wd.$("add-layer"));

      var styleObj = getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": 'background:'+id,
          "type": 'background'
        }
      ]);
    });

    it('fill', function () {
      var id = uuid();

      browser.waitForVisible(wd.$("layer-id", "input"));
      browser.setValue(wd.$("layer-id", "input"), "fill:"+id);
      browser.selectByValue(wd.$("layer-type", "select"), "fill");
      browser.setValue(wd.$("layer-source-block", "input"), "example");

      browser.click(wd.$("add-layer"));

      var styleObj = getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": 'fill:'+id,
          "type": 'fill',
          "source": "example"
        }
      ]);
    });

  });

  after(function() {
    // Code coverage
    var results = browser.execute(function() {
      return window.__coverage__;
    });

    var jsonStr = JSON.stringify(results.value, null, 2);
    fs.writeFileSync(BUILD_PATH+"/coverage.json", jsonStr);
  })


});
