import { test, setupMaputnik } from "./fixtures";

test.describe("history", () => {
  setupMaputnik();

  const undoKeyCombo = process.platform === "darwin" ? "{meta}z" : "{ctrl}z";
  const redoKeyCombo = process.platform === "darwin" ? "{meta}{shift}z" : "{ctrl}y";

  test("undo/redo", async ({ driver }) => {
    const { get, when, then } = driver;
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

  test("should not redo after undo and value change", async ({ driver }) => {
    const { get, when, then } = driver;
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
