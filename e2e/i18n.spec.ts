import { beforeEach, describe, test } from "./utils/fixtures";
import { MaputnikDriver } from "./maputnik-driver";

describe("i18n", () => {
  const { given, get, when, then } = new MaputnikDriver();

  beforeEach(async () => {
    await given.setupMockBackedResponses();
    await when.setStyle("both");
  });

  describe("language detector", () => {
    test("English", async () => {
      await when.visit("?lng=en");
      await then(get.elementByTestId("maputnik-lang-select")).shouldHaveValue("en");
    });

    test("Japanese", async () => {
      await when.visit("?lng=ja");
      await then(get.elementByTestId("maputnik-lang-select")).shouldHaveValue("ja");
    });
  });

  describe("language switcher", () => {
    beforeEach(async () => {
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
