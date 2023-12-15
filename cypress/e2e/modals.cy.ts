import driver from "./driver";

describe("modals", () => {
    beforeEach(() => {
        driver.beforeEach();
        driver.setStyle('');
    });
  describe("open", () => {
    beforeEach(() => {
        driver.click(driver.getDataAttribute("nav:open"));
    });

    it("close", () => {
      driver.closeModal("modal:open");
    });

    it("upload", async () => {
      driver.chooseExampleFile();

      var styleObj = await driver.getStyleStore();
      driver.isEqualToExampleFileData(styleObj);
    });

    it("load from url", async () => {
      var styleFileUrl = driver.getExampleFileUrl();

      driver.setValue(driver.getDataAttribute("modal:open.url.input"), styleFileUrl);
      driver.click(driver.getDataAttribute("modal:open.url.button"))
      driver.waitForExampleFileRequset();

      var styleObj = await driver.getStyleStore();
      driver.isEqualToExampleFileData(styleObj);
    });
  })

  describe("shortcuts", () => {
    it("open/close", async () => {
      driver.setStyle('');

      driver.typeKeys("?");

      driver.isDisplayedInViewport(driver.getDataAttribute("modal:shortcuts"));

      driver.closeModal("modal:shortcuts");
    });

  });

  describe("export", () => {
    beforeEach(() => {
      driver.click(driver.getDataAttribute("nav:export"));
    });

    it("close", () => {
      driver.closeModal("modal:export");
    });

    // TODO: Work out how to download a file and check the contents
    it("download")

  })

  describe("sources", () => {
    it("active sources")
    it("public source")
    it("add new source")
  })

  describe("inspect", () => {
    it("toggle", async () => {
      driver.setStyle('geojson');

      driver.select(driver.getDataAttribute("nav:inspect", "select"), "inspect");
    })
  })

  describe("style settings", () => {
    beforeEach(() => {
      driver.click(driver.getDataAttribute("nav:settings"));
    });

    it("name", async () => {
      driver.setValue(driver.getDataAttribute("modal:settings.name"), "foobar");
      driver.click(driver.getDataAttribute("modal:settings.owner"));

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.name, "foobar");
    })
    it("owner", async () => {
      driver.setValue(driver.getDataAttribute("modal:settings.owner"), "foobar")
      driver.click(driver.getDataAttribute("modal:settings.name"));

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.owner, "foobar");
    })
    it("sprite url", async () => {
      driver.setValue(driver.getDataAttribute("modal:settings.sprite"), "http://example.com")
      driver.click(driver.getDataAttribute("modal:settings.name"));

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.sprite, "http://example.com");
    })
    it("glyphs url", async () => {
      var glyphsUrl = "http://example.com/{fontstack}/{range}.pbf"
      driver.setValue(driver.getDataAttribute("modal:settings.glyphs"), glyphsUrl);
      driver.click(driver.getDataAttribute("modal:settings.name"));

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.glyphs, glyphsUrl);
    })

    it("maptiler access token", async () => {
      var apiKey = "testing123";
      driver.setValue(driver.getDataAttribute("modal:settings.maputnik:openmaptiles_access_token"), apiKey);
      driver.click(driver.getDataAttribute("modal:settings.name"));

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.metadata["maputnik:openmaptiles_access_token"], apiKey);
    })

    it("thunderforest access token", async () => {
      var apiKey = "testing123";
      driver.setValue(driver.getDataAttribute("modal:settings.maputnik:thunderforest_access_token"), apiKey);
      driver.click(driver.getDataAttribute("modal:settings.name"));

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.metadata["maputnik:thunderforest_access_token"], apiKey);
    })

    it("style renderer", async () => {
      driver.select(driver.getDataAttribute("modal:settings.maputnik:renderer"), "ol");
      driver.click(driver.getDataAttribute("modal:settings.name"));

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.metadata["maputnik:renderer"], "ol");
    })
  })

  describe("sources", () => {
    it("toggle")
  })
})
