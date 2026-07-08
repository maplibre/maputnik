import { MaputnikDriver } from "./maputnik-driver";

test.describe("code editor", () => {
  const { beforeAndAfter, when, get, then } = new MaputnikDriver();
  beforeAndAfter();

  test("open code editor", () => {
    when.click("nav:code-editor");
    then(get.element(".maputnik-code-editor")).shouldExist();
  });

  test("closes code editor", () => {
    when.click("nav:code-editor");
    then(get.element(".maputnik-code-editor")).shouldExist();
    when.click("nav:code-editor");
    then(get.element(".maputnik-code-editor")).shouldNotExist();
  });
});
