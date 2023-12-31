import { MaputnikDriver } from "./maputnik-driver";

describe("history", () => {
  let { beforeAndAfter, when, get, should } = new MaputnikDriver();
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

    should.equalStyleStore((a: any) => a.layers, []);

    when.modal.fillLayers({
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

    when.modal.open();
    when.modal.fillLayers({
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
