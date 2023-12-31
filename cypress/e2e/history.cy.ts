import { MaputnikDriver } from "./maputnik-driver";

describe("history", () => {
  let { beforeAndAfter, when, get, then } = new MaputnikDriver();
  beforeAndAfter();

  let undoKeyCombo: string;
  let redoKeyCombo: string;

  before(() => {
    const isMac = get.isMac();
    undoKeyCombo = isMac ? "{meta}z" : "{ctrl}z";
    redoKeyCombo = isMac ? "{meta}{shift}z" : "{ctrl}y";
  });

  it("undo/redo", () => {
    when.setStyle("geojson");
    when.modal.open();
    then(get.styleFromLocalStorage()).shouldDeepNestedInclude({ layers: [] });

    when.modal.fillLayers({
      id: "step 1",
      type: "background",
    });
    then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [
        {
          id: "step 1",
          type: "background",
        },
      ],
    });

    when.modal.open();
    when.modal.fillLayers({
      id: "step 2",
      type: "background",
    });

    then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [
        {
          id: "step 1",
          type: "background",
        },
        {
          id: "step 2",
          type: "background",
        },
      ],
    });

    when.typeKeys(undoKeyCombo);
    then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [
        {
          id: "step 1",
          type: "background",
        },
      ],
    });

    when.typeKeys(undoKeyCombo);
    then(get.styleFromLocalStorage()).shouldDeepNestedInclude({ layers: [] });

    when.typeKeys(redoKeyCombo);
    then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [
        {
          id: "step 1",
          type: "background",
        },
      ],
    });

    when.typeKeys(redoKeyCombo);
    then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [
        {
          id: "step 1",
          type: "background",
        },
        {
          id: "step 2",
          type: "background",
        },
      ],
    });
  });
});
