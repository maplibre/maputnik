import driver from "./driver";

describe("keyboard", () => {
  describe("shortcuts", () => {
    beforeEach(() => {
      driver.setupInterception();
      driver.setStyle("");
    });

    it("ESC should unfocus", () => {
      const targetSelector = driver.getDataAttribute("nav:inspect") + " select";
      driver.focus(targetSelector);
      driver.isFocused(targetSelector);

      driver.typeKeys("{esc}");
      expect(driver.shouldNotBeCFocused(targetSelector));
      //driver.isFocused('body');
    });

    it("'?' should show shortcuts modal", () => {
      driver.typeKeys("?");
      driver.isDisplayedInViewport(driver.getDataAttribute("modal:shortcuts"));
    });

    it("'o' should show open modal", () => {
      driver.typeKeys("o");
      driver.isDisplayedInViewport(driver.getDataAttribute("modal:open"));
    });

    it("'e' should show export modal", () => {
      driver.typeKeys("e");
      driver.isDisplayedInViewport(driver.getDataAttribute("modal:export"));
    });

    it("'d' should show sources modal", () => {
      driver.typeKeys("d");
      driver.isDisplayedInViewport(driver.getDataAttribute("modal:sources"));
    });

    it("'s' should show settings modal", () => {
      driver.typeKeys("s");
      driver.isDisplayedInViewport(driver.getDataAttribute("modal:settings"));
    });

    it("'i' should change map to inspect mode", () => {
      driver.typeKeys("i");
      driver.isSelected(driver.getDataAttribute("nav:inspect"), "inspect");
    });

    it("'m' should focus map", () => {
      driver.typeKeys("m");
      driver.isFocused(".maplibregl-canvas");
    });

    it("'!' should show debug modal", () => {
      driver.typeKeys("!");
      driver.isDisplayedInViewport(driver.getDataAttribute("modal:debug"));
    });
  });
});
