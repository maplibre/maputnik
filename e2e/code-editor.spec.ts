import { beforeEach, describe, test } from "./utils/fixtures";
import { MaputnikDriver } from "./maputnik-driver";

describe("code editor", () => {
  const { given, get, when, then } = new MaputnikDriver();

  beforeEach(async () => {
    await given.setupMockBackedResponses();
    await when.setStyle("both");
  });

  test("open code editor", async () => {
    await when.click("nav:code-editor");
    await then(get.element(".maputnik-code-editor")).shouldExist();
  });

  test("closes code editor", async () => {
    await when.click("nav:code-editor");
    await then(get.element(".maputnik-code-editor")).shouldExist();
    await when.click("nav:code-editor");
    await then(get.element(".maputnik-code-editor")).shouldNotExist();
  });
});
