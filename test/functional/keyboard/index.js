var assert = require("assert");
var config = require("../../config/specs");
var helper = require("../helper");
var wd     = require("../../wd-helper");


describe("keyboard", function() {
  describe("shortcuts", function() {
    it("ESC should unfocus", function() {
      const tmpTargetEl = $(wd.$("nav:inspect") + " select");
      tmpTargetEl.click();
      assert(tmpTargetEl.isFocused());

      browser.keys(["Escape"]);
      assert($("body").isFocused());
    });

    it("'?' should show shortcuts modal", function() {
      browser.keys(["?"]);
      assert($(wd.$("modal:shortcuts")).isDisplayed());
    });

    it("'o' should show open modal", function() {
      browser.keys(["o"]);
      assert($(wd.$("modal:open")).isDisplayed());
    });

    it("'e' should show export modal", function() {
      browser.keys(["e"]);
      assert($(wd.$("modal:export")).isDisplayed());
    });

    it("'d' should show sources modal", function() {
      browser.keys(["d"]);
      assert($(wd.$("modal:sources")).isDisplayed());
    });

    it("'s' should show settings modal", function() {
      browser.keys(["s"]);
      assert($(wd.$("modal:settings")).isDisplayed());
    });

    it.skip("'i' should change map to inspect mode", function() {
      // browser.keys(["i"]);
    });

    it("'m' should focus map", function() {
      browser.keys(["m"]);
      $(".mapboxgl-canvas").isFocused();
    });

    it("'!' should show debug modal", function() {
      browser.keys(["!"]);
      assert($(wd.$("modal:debug")).isDisplayed());
    });
  });

});
