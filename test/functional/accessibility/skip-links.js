var assert = require("assert");
var config = require("../../config/specs");
var helper = require("../helper");
var wd     = require("../../wd-helper");


describe("skip links", function() {
  beforeEach(async function () {
    await browser.url(config.baseUrl+"?debug&style="+helper.getGeoServerUrl("example-layer-style.json"));
    await browser.acceptAlert();
  });

  it("skip link to layer list", async function() {
    const selector = wd.$("root:skip:layer-list")
    const elem = await $(selector);
    assert(await elem.isExisting());
    await browser.keys(['Tab']);
    assert(await elem.isFocused());
    await elem.click();

    const targetEl = await $("#skip-target-layer-list");
    assert(await targetEl.isFocused());
  });

  it("skip link to layer editor", async function() {
    const selector = wd.$("root:skip:layer-editor")
    const elem = await $(selector);
    assert(await elem.isExisting());
    await browser.keys(['Tab']);
    await browser.keys(['Tab']);
    assert(await elem.isFocused());
    await elem.click();

    const targetEl = await $("#skip-target-layer-editor");
    assert(await targetEl.isFocused());
  });

  it("skip link to map view", async function() {
    const selector = wd.$("root:skip:map-view")
    const elem = await $(selector);
    assert(await elem.isExisting());
    await browser.keys(['Tab']);
    await browser.keys(['Tab']);
    await browser.keys(['Tab']);
    assert(await elem.isFocused());
    await elem.click();

    const targetEl = await $(".mapboxgl-canvas");
    assert(await targetEl.isFocused());
  });
});
