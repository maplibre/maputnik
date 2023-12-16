import driver from "./driver";

describe("history", () => {
  let undoKeyCombo: string;
  let redoKeyCombo: string;

  before(() => {
    const isMac = driver.isMac();
    undoKeyCombo = isMac ? '{meta}z' : '{ctrl}z';
    redoKeyCombo = isMac ? '{meta}{shift}z' : '{ctrl}y';
    driver.beforeEach();
  });

  it("undo/redo", () => {
    driver.setStyle('geojson');
    driver.openLayersModal();

    driver.isStyleStoreEqual((a: any) => a.layers, []);

    driver.fillLayersModal({
      id: "step 1",
      type: "background"
    })

    driver.isStyleStoreEqual((a: any) => a.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    driver.openLayersModal();
    driver.fillLayersModal({
      id: "step 2",
      type: "background"
    })

    driver.isStyleStoreEqual((a: any) => a.layers, [
      {
        "id": "step 1",
        "type": 'background'
      },
      {
        "id": "step 2",
        "type": 'background'
      }
    ]);

    driver.typeKeys(undoKeyCombo);
    driver.isStyleStoreEqual((a: any) => a.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    driver.typeKeys(undoKeyCombo)
    driver.isStyleStoreEqual((a: any) => a.layers, []);

    driver.typeKeys(redoKeyCombo)
    driver.isStyleStoreEqual((a: any) => a.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    driver.typeKeys(redoKeyCombo)
    driver.isStyleStoreEqual((a: any) => a.layers, [
      {
        "id": "step 1",
        "type": 'background'
      },
      {
        "id": "step 2",
        "type": 'background'
      }
    ]);
  });
})
