var assert = require("assert");
var config = require("../../config/specs");
var helper = require("../helper");
var wd     = require("../../wd-helper");


describe("skip links", function() {
  beforeEach(function () {
    browser.url(config.baseUrl+"?debug&style="+helper.getGeoServerUrl("example-layer-style.json"));
    browser.acceptAlert();
  });

  it("skip link to layer list", function() {
    const selector = wd.$("root:skip:layer-list")
    const elem = $(selector);
    assert(elem.isExisting());
    browser.keys(['Tab']);
    assert(elem.isFocused());
    elem.click();

    const targetEl = $("#skip-target-layer-list");
    assert(targetEl.isFocused());
  });

  it("skip link to layer editor", function() {
    const selector = wd.$("root:skip:layer-editor")
    const elem = $(selector);
    assert(elem.isExisting());
    browser.keys(['Tab']);
    browser.keys(['Tab']);
    assert(elem.isFocused());
    elem.click();

    const targetEl = $("#skip-target-layer-editor");
    assert(targetEl.isFocused());
  });

  it("skip link to map view", function() {
    const selector = wd.$("root:skip:map-view")
    const elem = $(selector);
    assert(elem.isExisting());
    browser.keys(['Tab']);
    browser.keys(['Tab']);
    browser.keys(['Tab']);
    assert(elem.isFocused());
    elem.click();

    const targetEl = $(".mapboxgl-canvas");
    assert(targetEl.isFocused());
  });
});
