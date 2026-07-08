import { MaputnikDriver } from "./maputnik-driver";

test.describe("i18n", () => {
  const { beforeAndAfter, get, when, then } = new MaputnikDriver();
  beforeAndAfter();

  test.describe("language detector", () => {
    test("English", () => {
      const url = "?lng=en";
      when.visit(url);
      then(get.elementByTestId("maputnik-lang-select")).shouldHaveValue("en");
    });

    test("Japanese", () => {
      const url = "?lng=ja";
      when.visit(url);
      then(get.elementByTestId("maputnik-lang-select")).shouldHaveValue("ja");
    });
  });

  test.describe("language switcher", () => {
    beforeEach(() => {
      when.setStyle("layer");
    });

    test("the language switcher switches to Japanese", () => {
      const selector = "maputnik-lang-select";
      then(get.elementByTestId(selector)).shouldExist();
      when.select(selector, "ja");
      then(get.elementByTestId(selector)).shouldHaveValue("ja");

      then(get.elementByTestId("nav:settings")).shouldHaveText("スタイル設定");
    });
  });
});
