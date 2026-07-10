import { test, describe, beforeEach } from "./utils/fixtures";
import { MaputnikDriver } from "./maputnik-driver";

describe("accessibility", () => {
  const { given, get, when, then } = new MaputnikDriver();

  beforeEach(async () => {
    await given.setupMockBackedResponses();
    await when.setStyle("both");
  });

  describe("skip links", () => {
    beforeEach(async () => {
      await when.setStyle("layer");
    });

    test("skip link to layer list", async () => {
      const selector = "root:skip:layer-list";
      await then(get.elementByTestId(selector)).shouldExist();
      await when.tab();
      await then(get.elementByTestId(selector)).shouldBeFocused();
      await when.click(selector);
      await then(get.skipTargetLayerList()).shouldBeFocused();
    });

    test("skip link to layer editor", async () => {
      const selector = "root:skip:layer-editor";
      await then(get.elementByTestId(selector)).shouldExist();
      await then(get.elementByTestId("skip-target-layer-editor")).shouldExist();
      await when.tab();
      await when.tab();
      await then(get.elementByTestId(selector)).shouldBeFocused();
      await when.click(selector);
      await then(get.skipTargetLayerEditor()).shouldBeFocused();
    });

    test("skip link to map view", async () => {
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
