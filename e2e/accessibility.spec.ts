import { MaputnikDriver } from "./maputnik-driver";

const test = it;

describe("accessibility", () => {
  const { beforeAndAfter, get, when, then } = new MaputnikDriver();
  beforeAndAfter();

  describe("skip links", () => {
    beforeEach(() => {
      when.setStyle("layer");
    });

    test("skip link to layer list", () => {
      const selector = "root:skip:layer-list";
      then(get.elementByTestId(selector)).shouldExist();
      when.tab();
      then(get.elementByTestId(selector)).shouldBeFocused();
      when.click(selector);
      then(get.skipTargetLayerList()).shouldBeFocused();
    });

    test("skip link to layer editor", () => {
      const selector = "root:skip:layer-editor";
      then(get.elementByTestId(selector)).shouldExist();
      then(get.elementByTestId("skip-target-layer-editor")).shouldExist();
      when.tab().tab();
      then(get.elementByTestId(selector)).shouldBeFocused();
      when.click(selector);
      then(get.skipTargetLayerEditor()).shouldBeFocused();
    });

    test("skip link to map view", () => {
      const selector = "root:skip:map-view";
      then(get.elementByTestId(selector)).shouldExist();
      when.tab().tab().tab();
      then(get.elementByTestId(selector)).shouldBeFocused();
      when.click(selector);
      then(get.canvas()).shouldBeFocused();
    });
  });
});
