import { then } from "@shellygo/cypress-test-utils/assertable";
import MaputnikDriver from "./maputnik-driver";

describe("modals", () => {
  let { beforeAndAfter, given, when, get, should } = new MaputnikDriver();
  beforeAndAfter();
  beforeEach(() => {
    given.fixture("example-style.json", "file:example-style.json");
    when.setStyle("");
  });
  describe("open", () => {
    beforeEach(() => {
      when.click("nav:open");
    });

    it.skip("close", () => {
      // Asserting non existence is an anti-pattern
      when.modal.close("modal:open");
      should.notExist("modal:open");
    });

    it.skip("upload", () => {
      // HM: I was not able to make the following choose file actually to select a file and close the modal...
      when.chooseExampleFile();
      then(get.responseBody("example-style.json")).shouldDeepEqual(
        get.maputnikStyleFromLocalStorageObj()
      );
    });

    describe("when click open url", () => {
      beforeEach(() => {
        let styleFileUrl = get.exampleFileUrl();

        when.setValue("modal:open.url.input", styleFileUrl);
        when.click("modal:open.url.button");
      });
      it.only("load from url", () => {
        // expect(
        //   Cypress._.isMatch(
        //     get.maputnikStyleFromLocalStorageObj(),
        //     get.responseBody("example-style.json")
        //   )
        // ).to.be.true;

        // expect(
        //   Cypress._.isMatch(
        //     get.maputnikStyleFromLocalStorageObj(),
        //     { shelly: true }
        //     //get.responseBody("example-style.json")
        //   )
        // );
        should.styleStoreEqualToExampleFileData();
        // then(get.fixture("file:example-style.json")).should(
        //   "deep.equal",
        //   get.maputnikStyleFromLocalStorageObj()
        // );
        // then(get.responseBody("example-style.json")).shouldDeepNestedInclude(
        //   get.maputnikStyleFromLocalStorageObj()
        // );
      });
    });
  });

  describe("shortcuts", () => {
    it.skip("open/close", () => {
      when.setStyle("");
      when.typeKeys("?");
      when.modal.close("modal:shortcuts");
      // Anti pattern. we should test that things exist. million things don't exist
      should.notExist("modal:shortcuts");
    });
  });

  describe("export", () => {
    beforeEach(() => {
      when.click("nav:export");
    });

    it.skip("close", () => {
      when.modal.close("modal:export");
      should.notExist("modal:export");
    });

    // TODO: Work out how to download a file and check the contents
    it("download");
  });

  describe("sources", () => {
    it("active sources");
    it("public source");
    it("add new source");
  });

  describe("inspect", () => {
    it("toggle", () => {
      // There is no assertion in this test
      when.setStyle("geojson");
      when.select("maputnik-select", "inspect");
    });
  });

  describe("style settings", () => {
    beforeEach(() => {
      when.click("nav:settings");
    });

    it("name", () => {
      when.click("field-doc-button-Name");
      then(get.elementsText("spec-field-doc")).shouldContainText(
        "name for the style"
      );
    });

    it("show name specifications", () => {
      when.setValue("modal:settings.name", "foobar");
      when.click("modal:settings.owner");
      then(get.maputnikStyleFromLocalStorage()).shouldDeepNestedInclude({
        name: "foobar",
      });
    });

    it("owner", () => {
      when.setValue("modal:settings.owner", "foobar");
      when.click("modal:settings.name");
      then(get.maputnikStyleFromLocalStorage()).shouldDeepNestedInclude({
        owner: "foobar",
      });
    });
    it("sprite url", () => {
      when.setValue("modal:settings.sprite", "http://example.com");
      when.click("modal:settings.name");
      then(get.maputnikStyleFromLocalStorage()).shouldDeepNestedInclude({
        sprite: "http://example.com",
      });
    });
    it("glyphs url", () => {
      let glyphsUrl = "http://example.com/{fontstack}/{range}.pbf";
      when.setValue("modal:settings.glyphs", glyphsUrl);
      when.click("modal:settings.name");
      then(get.maputnikStyleFromLocalStorage()).shouldDeepNestedInclude({
        glyphs: glyphsUrl,
      });
    });

    it("maptiler access token", () => {
      let apiKey = "testing123";
      when.setValue(
        "modal:settings.maputnik:openmaptiles_access_token",
        apiKey
      );
      when.click("modal:settings.name");
      then(get.maputnikStyleFromLocalStorage()).shouldDeepNestedInclude({
        metadata: { "maputnik:openmaptiles_access_token": apiKey },
      });
    });

    it("thunderforest access token", () => {
      let apiKey = "testing123";
      when.setValue(
        "modal:settings.maputnik:thunderforest_access_token",
        apiKey
      );
      when.click("modal:settings.name");
      then(get.maputnikStyleFromLocalStorage()).shouldDeepNestedInclude({
        metadata: { "maputnik:thunderforest_access_token": apiKey },
      });
    });

    it("style renderer", () => {
      cy.on("uncaught:exception", () => false); // this is due to the fact that this is an invalid style for openlayers
      when.select("modal:settings.maputnik:renderer", "ol");
      then(get.inputValue("modal:settings.maputnik:renderer")).shouldEqual(
        "ol"
      );

      when.click("modal:settings.name");
      then(get.maputnikStyleFromLocalStorage()).shouldDeepNestedInclude({
        metadata: { "maputnik:renderer": "ol" },
      });
    });
  });

  describe("sources", () => {
    it("toggle");
  });
});
