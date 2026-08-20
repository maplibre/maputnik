import { beforeEach, describe, test } from "./utils/fixtures";
import { MaputnikDriver } from "./maputnik-driver";

describe("sidebar resize", () => {
  const { given, get, when, then } = new MaputnikDriver();

  beforeEach(async () => {
    await given.setupMockBackedResponses();
    await when.setStyle("empty");
  });

  test("dragging the handle changes sidebar width", async () => {
    const initialHandle = get.elementByTestId("sidebar-resize-handle");
    const initialBox = await initialHandle.boundingBox();
    if (!initialBox) throw new Error("Sidebar handle not found");

    await when.resizeSidebar(100);

    const newBox = await initialHandle.boundingBox();
    if (!newBox) throw new Error("Sidebar handle not found after drag");

    await then(newBox.x).shouldBeGreaterThan(initialBox.x + 50);
  });

  test("dragging inner handle changes list/drawer split", async () => {
    const initialInnerHandle = get.elementByTestId("inner-resize-handle");
    const initialBox = await initialInnerHandle.boundingBox();
    if (!initialBox) throw new Error("Inner handle not found");

    await when.resizeInnerSidebar(50);

    const newBox = await initialInnerHandle.boundingBox();
    if (!newBox) throw new Error("Inner handle not found after drag");

    await then(newBox.x).shouldBeGreaterThan(initialBox.x + 20);
  });
});
