import { MaputnikDriver } from "./maputnik-driver";

describe("keyboard", () => {
  const { beforeAndAfter, given, when, get, then } = new MaputnikDriver();
  beforeAndAfter();
  describe("shortcuts", () => {
    beforeEach(() => {
      given.setupMockBackedResponses();
      when.setStyle("");
    });

    it("ESC should unfocus", () => {
      const targetSelector = "maputnik-select";
      when.focus(targetSelector);
      then(get.elementByTestId(targetSelector)).shouldBeFocused();
      when.typeKeys("{esc}");
      then(get.elementByTestId(targetSelector)).shouldNotBeFocused();
    });

    it("'?' should show shortcuts modal", () => {
      when.typeKeys("?");
      then(get.elementByTestId("modal:shortcuts")).shouldBeVisible();
    });

    it("'o' should show open modal", () => {
      when.typeKeys("o");
      then(get.elementByTestId("modal:open")).shouldBeVisible();
    });

    it("'e' should show export modal", () => {
      when.typeKeys("e");
      then(get.elementByTestId("modal:export")).shouldBeVisible();
    });

    it("'d' should show sources modal", () => {
      when.typeKeys("d");
      then(get.elementByTestId("modal:sources")).shouldBeVisible();
    });

    it("'s' should show settings modal", () => {
      when.typeKeys("s");
      then(get.elementByTestId("modal:settings")).shouldBeVisible();
    });

    it("'i' should change map to inspect mode", () => {
      when.typeKeys("i");
      then(get.inputValue("maputnik-select")).shouldEqual("inspect");
    });

    it("'m' should focus map", () => {
      when.typeKeys("m");
      then(get.canvas()).shouldBeFocused();
    });

    it("'!' should show debug modal", () => {
      when.typeKeys("!");
      then(get.elementByTestId("modal:debug")).shouldBeVisible();
    });
  });
});
