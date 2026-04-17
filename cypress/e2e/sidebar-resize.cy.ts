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

      get.elementByTestId("sidebar-resize-handle")
        .realMouseDown({ position: "center" })
        .realMouseMove(100, 0, { position: "center" })
        .realMouseUp();

      get.element(".maputnik-layout-list").should(($listAfter) => {
        const newWidth = $listAfter[0].getBoundingClientRect().width;
        expect(newWidth).to.be.greaterThan(initialWidth);
      });
    });
  });

  it("dragging inner handle changes list/drawer split", () => {
    get.element(".maputnik-layout-list").then(($list) => {
      const initialWidth = $list[0].getBoundingClientRect().width;

      get.elementByTestId("inner-resize-handle")
        .realMouseDown({ position: "center" })
        .realMouseMove(80, 0, { position: "center" })
        .realMouseUp();

      get.element(".maputnik-layout-list").should(($listAfter) => {
        const newWidth = $listAfter[0].getBoundingClientRect().width;
        expect(newWidth).to.be.greaterThan(initialWidth);
      });
    });
  });
});
