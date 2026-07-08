import { test, setupMaputnik } from "./fixtures";

test.describe("i18n", () => {
  setupMaputnik();

  test.describe("language detector", () => {
    test("English", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.visit("?lng=en");
      await then(get.elementByTestId("maputnik-lang-select")).shouldHaveValue("en");
    });

    test("Japanese", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.visit("?lng=ja");
      await then(get.elementByTestId("maputnik-lang-select")).shouldHaveValue("ja");
    });
  });

  test.describe("language switcher", () => {
    test.beforeEach(async ({ driver }) => {
      await driver.when.setStyle("layer");
    });

    test("the language switcher switches to Japanese", async ({ driver }) => {
      const { get, when, then } = driver;
      const selector = "maputnik-lang-select";
      await then(get.elementByTestId(selector)).shouldExist();
      await when.select(selector, "ja");
      await then(get.elementByTestId(selector)).shouldHaveValue("ja");

      await then(get.elementByTestId("nav:settings")).shouldHaveText("スタイル設定");
    });
  });
});
