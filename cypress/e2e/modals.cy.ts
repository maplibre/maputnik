import MaputnikDriver from "./driver";

describe("modals", () => {
  let { beforeAndAfter, given, when, get, should } = new MaputnikDriver();
  beforeAndAfter();
  beforeEach(() => {
    when.setStyle("");
  });
  describe("open", () => {
    beforeEach(() => {
      when.click("nav:open");
    });

    it("close", () => {
      when.closeModal("modal:open");
      should.notExist("modal:open");
    });

    it.skip("upload", () => {
      // HM: I was not able to make the following choose file actually to select a file and close the modal...
      when.chooseExampleFile();

      should.isStyleStoreEqualToExampleFileData();
    });

    it("load from url", () => {
      var styleFileUrl = get.getExampleFileUrl();

      when.setValue(get.getDataAttribute("modal:open.url.input"), styleFileUrl);
      when.click("modal:open.url.button");
      when.waitForExampleFileRequset();

      should.isStyleStoreEqualToExampleFileData();
    });
  });

  describe("shortcuts", () => {
    it("open/close", () => {
      when.setStyle("");
      when.typeKeys("?");
      when.closeModal("modal:shortcuts");
      should.notExist("modal:shortcuts");
    });
  });

  describe("export", () => {
    beforeEach(() => {
      when.click("nav:export");
    });

    it("close", () => {
      when.closeModal("modal:export");
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
      when.setStyle("geojson");

      when.select(get.getDataAttribute("nav:inspect", "select"), "inspect");
    });
  });

  describe("style settings", () => {
    beforeEach(() => {
      when.click("nav:settings");
    });

    it("name", () => {
      when.setValue(get.getDataAttribute("modal:settings.name"), "foobar");
      when.click("modal:settings.owner");

      should.equalStyleStore((obj) => obj.name, "foobar");
    });
    it("owner", () => {
      when.setValue(get.getDataAttribute("modal:settings.owner"), "foobar");
      when.click("modal:settings.name");

      should.equalStyleStore((obj) => obj.owner, "foobar");
    });
    it("sprite url", () => {
      when.setValue(
        get.getDataAttribute("modal:settings.sprite"),
        "http://example.com"
      );
      when.click("modal:settings.name");

      should.equalStyleStore((obj) => obj.sprite, "http://example.com");
    });
    it("glyphs url", () => {
      var glyphsUrl = "http://example.com/{fontstack}/{range}.pbf";
      when.setValue(get.getDataAttribute("modal:settings.glyphs"), glyphsUrl);
      when.click("modal:settings.name");

      should.equalStyleStore((obj) => obj.glyphs, glyphsUrl);
    });

    it("maptiler access token", () => {
      var apiKey = "testing123";
      when.setValue(
        get.getDataAttribute(
          "modal:settings.maputnik:openmaptiles_access_token"
        ),
        apiKey
      );
      when.click("modal:settings.name");

      should.equalStyleStore(
        (obj) => obj.metadata["maputnik:openmaptiles_access_token"],
        apiKey
      );
    });

    it("thunderforest access token", () => {
      var apiKey = "testing123";
      when.setValue(
        get.getDataAttribute(
          "modal:settings.maputnik:thunderforest_access_token"
        ),
        apiKey
      );
      when.click("modal:settings.name");

      should.equalStyleStore(
        (obj) => obj.metadata["maputnik:thunderforest_access_token"],
        apiKey
      );
    });

    it("style renderer", () => {
      cy.on("uncaught:exception", () => false); // this is due to the fact that this is an invalid style for openlayers
      when.select(
        get.getDataAttribute("modal:settings.maputnik:renderer"),
        "ol"
      );
      should.isSelected(
        get.getDataAttribute("modal:settings.maputnik:renderer"),
        "ol"
      );

      when.click("modal:settings.name");

      should.equalStyleStore((obj) => obj.metadata["maputnik:renderer"], "ol");
    });
  });

  describe("sources", () => {
    it("toggle");
  });
});
