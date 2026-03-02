import { MaputnikDriver } from "./maputnik-driver";

describe("sidebar resize", () => {
  const { beforeAndAfter, when } = new MaputnikDriver();
  beforeAndAfter();

  beforeEach(() => {
    when.setStyle("both");
  });

  it("resize handle is visible", () => {
    cy.get("[data-testid='sidebar-resize-handle']").should("exist").and("be.visible");
  });

  it("dragging the handle changes sidebar width", () => {
    cy.get(".maputnik-layout-list").then(($list) => {
      const initialWidth = $list[0].getBoundingClientRect().width;

      cy.get("[data-testid='sidebar-resize-handle']")
        .realMouseDown({ position: "center" })
        .realMouseMove(100, 0, { position: "center" })
        .realMouseUp();

      cy.get(".maputnik-layout-list").should(($listAfter) => {
        const newWidth = $listAfter[0].getBoundingClientRect().width;
        expect(newWidth).to.be.greaterThan(initialWidth);
      });
    });
  });
});
