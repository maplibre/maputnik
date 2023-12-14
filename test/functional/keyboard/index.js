var assert = require("assert");
var driver = require("../driver");

describe("keyboard", function() {
  describe("shortcuts", function() {
    it("ESC should unfocus", async function() {
      const targetSelector = driver.getDataAttribute("nav:inspect") + " select";
      driver.click(targetSelector);
      assert(await driver.isFocused(targetSelector));

      await driver.typeKeys(["Escape"]);
      assert(await (await $("body")).isFocused());
    });

    it("'?' should show shortcuts modal", async function() {
      await driver.typeKeys(["?"]);
      assert(await driver.isDisplayedInViewport(driver.getDataAttribute("modal:shortcuts")));
    });

    it("'o' should show open modal", async function() {
      await driver.typeKeys(["o"]);
      assert(await driver.isDisplayedInViewport(driver.getDataAttribute("modal:open")));
    });

    it("'e' should show export modal", async function() {
      await driver.typeKeys(["e"]);
      await driver.sleep(100);
      assert(await driver.isDisplayedInViewport(driver.getDataAttribute("modal:export")));
    });

    it("'d' should show sources modal", async function() {
      await driver.typeKeys(["d"]);
      assert(await driver.isDisplayedInViewport(driver.getDataAttribute("modal:sources")));
    });

    it("'s' should show settings modal", async function() {
      await driver.typeKeys(["s"]);
      assert(await driver.isDisplayedInViewport(driver.getDataAttribute("modal:settings")));
    });

    it.skip("'i' should change map to inspect mode", async function() {
      // await driver.typeKeys(["i"]);
    });

    it("'m' should focus map", async function() {
      await driver.typeKeys(["m"]);
      assert(await driver.isFocused(".maplibregl-canvas"));
    });

    it("'!' should show debug modal", async function() {
      await driver.typeKeys(["!"]);
      assert(await driver.isDisplayedInViewport(driver.getDataAttribute("modal:debug")));
    });
  });

});
