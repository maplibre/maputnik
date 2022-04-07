var assert = require("assert");
var wd     = require("../../wd-helper");


describe("keyboard", function() {
  describe("shortcuts", function() {
    it("ESC should unfocus", async function() {
      const tmpTargetEl = await $(wd.$("nav:inspect") + " select");
      await tmpTargetEl.click();
      assert(await tmpTargetEl.isFocused());

      await browser.keys(["Escape"]);
      assert(await (await $("body")).isFocused());
    });

    it("'?' should show shortcuts modal", async function() {
      await browser.keys(["?"]);
      assert(await (await $(wd.$("modal:shortcuts"))).isDisplayed());
    });

    it("'o' should show open modal", async function() {
      await browser.keys(["o"]);
      assert(await (await $(wd.$("modal:open"))).isDisplayed());
    });

    it("'e' should show export modal", async function() {
      await browser.keys(["e"]);
      assert(await (await $(wd.$("modal:export"))).isDisplayed());
    });

    it("'d' should show sources modal", async function() {
      await browser.keys(["d"]);
      assert(await (await $(wd.$("modal:sources"))).isDisplayed());
    });

    it("'s' should show settings modal", async function() {
      await browser.keys(["s"]);
      assert(await (await $(wd.$("modal:settings"))).isDisplayed());
    });

    it.skip("'i' should change map to inspect mode", async function() {
      // await browser.keys(["i"]);
    });

    it("'m' should focus map", async function() {
      await browser.keys(["m"]);
      assert(await (await $(".mapboxgl-canvas")).isFocused());
    });

    it("'!' should show debug modal", async function() {
      await browser.keys(["!"]);
      assert(await (await $(wd.$("modal:debug"))).isDisplayed());
    });
  });

});
