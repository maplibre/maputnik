import { MaputnikDriver } from "./maputnik-driver";

describe("i18n", () => {
  let { beforeAndAfter, get, when, then } = new MaputnikDriver();
  beforeAndAfter();

  describe("language detector", () => {
    it("English", () => {
      const url = "?lng=en";
      when.visit(url);
      then(get.elementByTestId("maputnik-lang-select")).shouldHaveValue("en");
    });

    it("Japanese", () => {
      const url = "?lng=ja";
      when.visit(url);
      then(get.elementByTestId("maputnik-lang-select")).shouldHaveValue("ja");
    });
  });

  describe("language switcher", () => {
    beforeEach(() => {
      when.setStyle("layer");
    });

    it("the language switcher switches to Japanese", () => {
      const selector = "maputnik-lang-select";
      then(get.elementByTestId(selector)).shouldExist();
      when.select(selector, "ja");
      then(get.elementByTestId(selector)).shouldHaveValue("ja");

      then(get.elementByTestId("nav:settings")).shouldHaveText("スタイル設定");
    });
  });
});
