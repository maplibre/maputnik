import MaputnikDriver from "./driver";

describe("history", () => {
  let { beforeAndAfter, given, when, get, should } = new MaputnikDriver();
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
    when.openLayersModal();

    should.equalStyleStore((a: any) => a.layers, []);

    when.fillLayersModal({
      id: "step 1",
      type: "background",
    });

    should.equalStyleStore(
      (a: any) => a.layers,
      [
        {
          id: "step 1",
          type: "background",
        },
      ]
    );

    when.openLayersModal();
    when.fillLayersModal({
      id: "step 2",
      type: "background",
    });

    should.equalStyleStore(
      (a: any) => a.layers,
      [
        {
          id: "step 1",
          type: "background",
        },
        {
          id: "step 2",
          type: "background",
        },
      ]
    );

    when.typeKeys(undoKeyCombo);
    should.equalStyleStore(
      (a: any) => a.layers,
      [
        {
          id: "step 1",
          type: "background",
        },
      ]
    );

    when.typeKeys(undoKeyCombo);
    should.equalStyleStore((a: any) => a.layers, []);

    when.typeKeys(redoKeyCombo);
    should.equalStyleStore(
      (a: any) => a.layers,
      [
        {
          id: "step 1",
          type: "background",
        },
      ]
    );

    when.typeKeys(redoKeyCombo);
    should.equalStyleStore(
      (a: any) => a.layers,
      [
        {
          id: "step 1",
          type: "background",
        },
        {
          id: "step 2",
          type: "background",
        },
      ]
    );
  });
});
