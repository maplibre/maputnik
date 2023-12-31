import { MaputnikDriver, then } from "./maputnik-driver";

describe("modals", () => {
  let { beforeAndAfter, when, get } = new MaputnikDriver();
  beforeAndAfter();

  beforeEach(() => {
    when.visit("/");
  });
  describe("open", () => {
    beforeEach(() => {
      when.click("nav:open");
    });

    it("close", () => {
      when.modal.close("modal:open");
      then(get.elementByTestId("modal:open")).shouldNotExist();
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
        when.wait(200);
      });
      it("load from url", () => {
        then(get.responseBody("example-style.json")).shouldDeepEqual(
          get.maputnikStyleFromLocalStorageObj()
        );
      });
    });
  });

  describe("shortcuts", () => {
    it("open/close", () => {
      when.setStyle("");
      when.typeKeys("?");
      when.modal.close("modal:shortcuts");
      then(get.elementByTestId("modal:shortcuts")).shouldNotExist();
    });
  });

  describe("export", () => {
    beforeEach(() => {
      when.click("nav:export");
    });

    it.skip("close", () => {
      when.modal.close("modal:export");
      then(get.elementByTestId("modal:export")).shouldNotExist();
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

    describe("when click name", () => {
      beforeEach(() => {
        when.click("field-doc-button-Name");
      });

      it("name", () => {
        then(get.elementsText("spec-field-doc")).shouldInclude(
          "name for the style"
        );
      });
    });

    describe("when set name and click owner", () => {
      beforeEach(() => {
        when.setValue("modal:settings.name", "foobar");
        when.click("modal:settings.owner");
        when.wait(200);
      });

      it("show name specifications", () => {
        then(get.maputnikStyleFromLocalStorage()).shouldDeepNestedInclude({
          name: "foobar",
        });
      });
    });

    describe("when set owner and click name", () => {
      beforeEach(() => {
        when.setValue("modal:settings.owner", "foobar");
        when.click("modal:settings.name");
        when.wait(200);
      });
      it("should update owner in local storage", () => {
        then(get.maputnikStyleFromLocalStorage()).shouldDeepNestedInclude({
          owner: "foobar",
        });
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
