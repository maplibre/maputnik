import { MaputnikDriver } from "./maputnik-driver";

describe("map", () => {
  const { beforeAndAfter, get, when, then } = new MaputnikDriver();
  beforeAndAfter();
  describe("zoom level", () => {
    it("via url", () => {
      const zoomLevel = 12.37;
      when.setStyle("geojson", zoomLevel);
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldBeVisible();
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldContainText(
        "Zoom: " + zoomLevel
      );
    });

    it("via map controls", () => {
      const zoomLevel = 12.37;
      when.setStyle("geojson", zoomLevel);
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldBeVisible();
      when.clickZoomIn();
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldContainText(
        "Zoom: " + (zoomLevel + 1)
      );
    });

    it("via style file definition", () => {
      when.setStyle("zoom_center");
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldBeVisible();
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldContainText(
        "Zoom: " + (7)
      );
      cy.location("hash").should("contain", "#7/51.5/0");

      cy.contains("button", "Open").click();

      cy.get('[data-wd-key="modal:open.url.input"]')
        .should("be.enabled")
        .clear()
        .type("http://localhost:8888/example-style-with-zoom-and-center2.json{enter}");

      cy.location("hash").should("contain", "#7/51.5/0");

    });
  });

  describe("search", () => {
    it("should exist", () => {
      then(get.searchControl()).shouldBeVisible();
    });
  });

  describe("popup", () => {
    beforeEach(() => {
      when.setStyle("rectangles");
      cy.location("hash").should("exist");
    });
    it("should open on feature click", () => {
      when.clickCenter("maplibre:map");
      then(get.elementByTestId("feature-layer-popup")).shouldBeVisible();
    });

    it("should open a second feature after closing popup", () => {
      when.clickCenter("maplibre:map");
      then(get.elementByTestId("feature-layer-popup")).shouldBeVisible();
      when.closePopup();
      then(get.elementByTestId("feature-layer-popup")).shouldNotExist();
      when.clickCenter("maplibre:map");
      then(get.elementByTestId("feature-layer-popup")).shouldBeVisible();
    });
  });
});
