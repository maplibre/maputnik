import { test, setupMaputnik } from "./fixtures";

test.describe("keyboard", () => {
  setupMaputnik();

  test.describe("shortcuts", () => {
    test.beforeEach(async ({ driver }) => {
      await driver.given.setupMockBackedResponses();
      await driver.when.setStyle("");
    });

    test("ESC should unfocus", async ({ driver }) => {
      const { get, when, then } = driver;
      const targetSelector = "maputnik-select";
      await when.focus(targetSelector);
      await then(get.elementByTestId(targetSelector)).shouldBeFocused();
      await when.typeKeys("{esc}");
      await then(get.elementByTestId(targetSelector)).shouldNotBeFocused();
    });

    test("'?' should show shortcuts modal", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.typeKeys("?");
      await then(get.elementByTestId("modal:shortcuts")).shouldBeVisible();
    });

    test("'o' should show open modal", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.typeKeys("o");
      await then(get.elementByTestId("modal:open")).shouldBeVisible();
    });

    test("'e' should show export modal", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.typeKeys("e");
      await then(get.elementByTestId("modal:export")).shouldBeVisible();
    });

    test("'d' should show sources modal", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.typeKeys("d");
      await then(get.elementByTestId("modal:sources")).shouldBeVisible();
    });

    test("'s' should show settings modal", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.typeKeys("s");
      await then(get.elementByTestId("modal:settings")).shouldBeVisible();
    });

    test("'i' should change map to inspect mode", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.typeKeys("i");
      await then(get.inputValue("maputnik-select")).shouldEqual("inspect");
    });

    test("'m' should focus map", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.typeKeys("m");
      await then(get.canvas()).shouldBeFocused();
    });

    test("'!' should show debug modal", async ({ driver }) => {
      const { get, when, then } = driver;
      await when.typeKeys("!");
      await then(get.elementByTestId("modal:debug")).shouldBeVisible();
    });
  });
});
