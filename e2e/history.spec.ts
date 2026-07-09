import { beforeEach, describe, test } from "./utils/fixtures";
import { MaputnikDriver } from "./maputnik-driver";

describe("history", () => {
  const { given, get, when, then } = new MaputnikDriver();

  const undoKeyCombo = process.platform === "darwin" ? "{meta}z" : "{ctrl}z";
  const redoKeyCombo = process.platform === "darwin" ? "{meta}{shift}z" : "{ctrl}y";

  beforeEach(async () => {
    await given.setupMockBackedResponses();
    await when.setStyle("both");
  });

  test("undo/redo", async () => {
    await when.setStyle("geojson");
    await when.modal.open();

    await when.modal.fillLayers({
      id: "step 1",
      type: "background",
    });
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [{ id: "step 1", type: "background" }],
    });

    await when.modal.open();
    await when.modal.fillLayers({
      id: "step 2",
      type: "background",
    });
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [
        { id: "step 1", type: "background" },
        { id: "step 2", type: "background" },
      ],
    });

    await when.typeKeys(undoKeyCombo);
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [{ id: "step 1", type: "background" }],
    });

    await when.typeKeys(undoKeyCombo);
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({ layers: [] });

    await when.typeKeys(redoKeyCombo);
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [{ id: "step 1", type: "background" }],
    });

    await when.typeKeys(redoKeyCombo);
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [
        { id: "step 1", type: "background" },
        { id: "step 2", type: "background" },
      ],
    });
  });

  test("should not redo after undo and value change", async () => {
    await when.setStyle("geojson");
    await when.modal.open();
    await when.modal.fillLayers({
      id: "step 1",
      type: "background",
    });

    await when.modal.open();
    await when.modal.fillLayers({
      id: "step 2",
      type: "background",
    });

    await when.typeKeys(undoKeyCombo);
    await when.typeKeys(undoKeyCombo);
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({ layers: [] });

    await when.modal.open();
    await when.modal.fillLayers({
      id: "step 3",
      type: "background",
    });

    await when.typeKeys(redoKeyCombo);
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [{ id: "step 3", type: "background" }],
    });
  });
});
