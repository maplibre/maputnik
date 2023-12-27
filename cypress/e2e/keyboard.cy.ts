import MaputnikDriver from "./driver";

describe("keyboard", () => {
  let { beforeAndAfter, given, when, should } = new MaputnikDriver();
  beforeAndAfter();
  describe("shortcuts", () => {
    beforeEach(() => {
      given.setupInterception();
      when.setStyle("");
    });

    it("ESC should unfocus", () => {
      const targetSelector = "maputnik-select";
      when.focus(targetSelector);
      should.beFocused(targetSelector);

      when.typeKeys("{esc}");
      expect(should.notBeFocused(targetSelector));
    });

    it("'?' should show shortcuts modal", () => {
      when.typeKeys("?");
      should.beVisible("modal:shortcuts");
    });

    it("'o' should show open modal", () => {
      when.typeKeys("o");
      should.beVisible("modal:open");
    });

    it("'e' should show export modal", () => {
      when.typeKeys("e");
      should.beVisible("modal:export");
    });

    it("'d' should show sources modal", () => {
      when.typeKeys("d");
      should.beVisible("modal:sources");
    });

    it("'s' should show settings modal", () => {
      when.typeKeys("s");
      should.beVisible("modal:settings");
    });

    it("'i' should change map to inspect mode", () => {
      when.typeKeys("i");
      should.beSelected("nav:inspect", "inspect");
    });

    it("'m' should focus map", () => {
      when.typeKeys("m");
      should.canvasBeFocused();
    });

    it("'!' should show debug modal", () => {
      when.typeKeys("!");
      should.beVisible("modal:debug");
    });
  });
});
