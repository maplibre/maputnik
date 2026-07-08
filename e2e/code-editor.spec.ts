import { test, setupMaputnik } from "./fixtures";

test.describe("code editor", () => {
  setupMaputnik();

  test("open code editor", async ({ driver }) => {
    const { when, get, then } = driver;
    await when.click("nav:code-editor");
    await then(get.element(".maputnik-code-editor")).shouldExist();
  });

  test("closes code editor", async ({ driver }) => {
    const { when, get, then } = driver;
    await when.click("nav:code-editor");
    await then(get.element(".maputnik-code-editor")).shouldExist();
    await when.click("nav:code-editor");
    await then(get.element(".maputnik-code-editor")).shouldNotExist();
  });
});
