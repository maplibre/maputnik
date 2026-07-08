import { test } from "./fixtures";
import { MaputnikDriver } from "./maputnik-driver";

test.describe("i18n", () => {
  const { given, get, when, then } = new MaputnikDriver();

  test.beforeEach(async () => {
    await given.setupMockBackedResponses();
    await when.setStyle("both");
  });

  test.describe("language detector", () => {
    test("English", async () => {
      await when.visit("?lng=en");
      await then(get.elementByTestId("maputnik-lang-select")).shouldHaveValue("en");
    });

    test("Japanese", async () => {
      await when.visit("?lng=ja");
      await then(get.elementByTestId("maputnik-lang-select")).shouldHaveValue("ja");
    });
  });

  test.describe("language switcher", () => {
    test.beforeEach(async () => {
      await when.setStyle("layer");
    });

    test("the language switcher switches to Japanese", async () => {
      const selector = "maputnik-lang-select";
      await then(get.elementByTestId(selector)).shouldExist();
      await when.select(selector, "ja");
      await then(get.elementByTestId(selector)).shouldHaveValue("ja");

      await then(get.elementByTestId("nav:settings")).shouldHaveText("スタイル設定");
    });
  });
});
