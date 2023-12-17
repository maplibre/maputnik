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

    it.skip("upload", () => {
      // HM: I was not able to make the following choose file actually to select a file and close the modal...
      driver.chooseExampleFile();

      driver.isStyleStoreEqualToExampleFileData();
    });

    it("load from url", () => {
      var styleFileUrl = driver.getExampleFileUrl();

      driver.setValue(driver.getDataAttribute("modal:open.url.input"), styleFileUrl);
      driver.click(driver.getDataAttribute("modal:open.url.button"))
      driver.waitForExampleFileRequset();

      driver.isStyleStoreEqualToExampleFileData();
    });
  })

  describe("shortcuts", () => {
    it("open/close", () => {
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
    it("toggle", () => {
      driver.setStyle('geojson');

      driver.select(driver.getDataAttribute("nav:inspect", "select"), "inspect");
    })
  })

  describe("style settings", () => {
    beforeEach(() => {
      driver.click(driver.getDataAttribute("nav:settings"));
    });

    it("name", () => {
      driver.setValue(driver.getDataAttribute("modal:settings.name"), "foobar");
      driver.click(driver.getDataAttribute("modal:settings.owner"));

      driver.isStyleStoreEqual((obj) => obj.name, "foobar");
    })
    it("owner", () => {
      driver.setValue(driver.getDataAttribute("modal:settings.owner"), "foobar")
      driver.click(driver.getDataAttribute("modal:settings.name"));

      driver.isStyleStoreEqual((obj) => obj.owner, "foobar");
    })
    it("sprite url", () => {
      driver.setValue(driver.getDataAttribute("modal:settings.sprite"), "http://example.com")
      driver.click(driver.getDataAttribute("modal:settings.name"));

      driver.isStyleStoreEqual((obj) => obj.sprite, "http://example.com");
    })
    it("glyphs url", () => {
      var glyphsUrl = "http://example.com/{fontstack}/{range}.pbf"
      driver.setValue(driver.getDataAttribute("modal:settings.glyphs"), glyphsUrl);
      driver.click(driver.getDataAttribute("modal:settings.name"));

      driver.isStyleStoreEqual((obj) => obj.glyphs, glyphsUrl);
    })

    it("maptiler access token", () => {
      var apiKey = "testing123";
      driver.setValue(driver.getDataAttribute("modal:settings.maputnik:openmaptiles_access_token"), apiKey);
      driver.click(driver.getDataAttribute("modal:settings.name"));

      driver.isStyleStoreEqual((obj) => obj.metadata["maputnik:openmaptiles_access_token"], apiKey);
    })

    it("thunderforest access token", () => {
      var apiKey = "testing123";
      driver.setValue(driver.getDataAttribute("modal:settings.maputnik:thunderforest_access_token"), apiKey);
      driver.click(driver.getDataAttribute("modal:settings.name"));

      driver.isStyleStoreEqual((obj) => obj.metadata["maputnik:thunderforest_access_token"], apiKey);
    })

    it("style renderer", () => {
      cy.on('uncaught:exception', () => false); // this is due to the fact that this is an invalid style for openlayers
      driver.select(driver.getDataAttribute("modal:settings.maputnik:renderer"), "ol");
      driver.isSelected(driver.getDataAttribute("modal:settings.maputnik:renderer"), "ol");
      
      driver.click(driver.getDataAttribute("modal:settings.name"));

      driver.isStyleStoreEqual((obj) => obj.metadata["maputnik:renderer"], "ol");
    })
  })

  describe("sources", () => {
    it("toggle")
  })
})
