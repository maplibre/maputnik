import { MaputnikDriver } from "./maputnik-driver";

describe("sidebar resize", () => {
  const { beforeAndAfter, get, when, then } = new MaputnikDriver();
  beforeAndAfter();

  beforeEach(() => {
    when.setStyle("both");
  });

  it("resize handle is visible", () => {
    then(get.elementByTestId("sidebar-resize-handle")).shouldBeVisible();
  });

  it("inner resize handle is visible", () => {
    then(get.elementByTestId("inner-resize-handle")).shouldBeVisible();
  });

  it("dragging the handle changes sidebar width", () => {
    get.element(".maputnik-layout-list").then(($list) => {
      const initialWidth = $list[0].getBoundingClientRect().width;

      get.elementByTestId("sidebar-resize-handle").then(($handle) => {
        const rect = $handle[0].getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        cy.document().trigger("pointerdown", {
          clientX: startX,
          clientY: startY,
          pointerId: 1,
          button: 0,
          buttons: 1,
          pointerType: "mouse",
          bubbles: true,
        });
        cy.document().trigger("pointermove", {
          clientX: startX + 100,
          clientY: startY,
          pointerId: 1,
          button: 0,
          buttons: 1,
          pointerType: "mouse",
          bubbles: true,
        });
        cy.document().trigger("pointerup", {
          clientX: startX + 100,
          clientY: startY,
          pointerId: 1,
          button: 0,
          buttons: 0,
          pointerType: "mouse",
          bubbles: true,
        });
      });

      get.element(".maputnik-layout-list").should(($listAfter) => {
        const newWidth = $listAfter[0].getBoundingClientRect().width;
        expect(newWidth).to.be.greaterThan(initialWidth);
      });
    });
  });

  it("dragging inner handle changes list/drawer split", () => {
    get.element(".maputnik-layout-list").then(($list) => {
      const initialWidth = $list[0].getBoundingClientRect().width;

      get.elementByTestId("inner-resize-handle").then(($handle) => {
        const rect = $handle[0].getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        cy.document().trigger("pointerdown", {
          clientX: startX,
          clientY: startY,
          pointerId: 1,
          button: 0,
          buttons: 1,
          pointerType: "mouse",
          bubbles: true,
        });
        cy.document().trigger("pointermove", {
          clientX: startX + 80,
          clientY: startY,
          pointerId: 1,
          button: 0,
          buttons: 1,
          pointerType: "mouse",
          bubbles: true,
        });
        cy.document().trigger("pointerup", {
          clientX: startX + 80,
          clientY: startY,
          pointerId: 1,
          button: 0,
          buttons: 0,
          pointerType: "mouse",
          bubbles: true,
        });
      });

      get.element(".maputnik-layout-list").should(($listAfter) => {
        const newWidth = $listAfter[0].getBoundingClientRect().width;
        expect(newWidth).to.be.greaterThan(initialWidth);
      });
    });
  });
});
