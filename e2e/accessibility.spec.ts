import { test, setupMaputnik } from "./fixtures";

test.describe("accessibility", () => {
  setupMaputnik();

  test.describe("skip links", () => {
    test.beforeEach(async ({ driver }) => {
      await driver.when.setStyle("layer");
    });

    test("skip link to layer list", async ({ driver }) => {
      const { get, when, then } = driver;
      const selector = "root:skip:layer-list";
      await then(get.elementByTestId(selector)).shouldExist();
      await when.tab();
      await then(get.elementByTestId(selector)).shouldBeFocused();
      await when.click(selector);
      await then(get.skipTargetLayerList()).shouldBeFocused();
    });

    test("skip link to layer editor", async ({ driver }) => {
      const { get, when, then } = driver;
      const selector = "root:skip:layer-editor";
      await then(get.elementByTestId(selector)).shouldExist();
      await then(get.elementByTestId("skip-target-layer-editor")).shouldExist();
      await when.tab();
      await when.tab();
      await then(get.elementByTestId(selector)).shouldBeFocused();
      await when.click(selector);
      await then(get.skipTargetLayerEditor()).shouldBeFocused();
    });

    test("skip link to map view", async ({ driver }) => {
      const { get, when, then } = driver;
      const selector = "root:skip:map-view";
      await then(get.elementByTestId(selector)).shouldExist();
      await when.tab();
      await when.tab();
      await when.tab();
      await then(get.elementByTestId(selector)).shouldBeFocused();
      await when.click(selector);
      await then(get.canvas()).shouldBeFocused();
    });
  });
});
