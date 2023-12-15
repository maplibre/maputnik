import driver from "./driver";

describe("history", () => {
  let undoKeyCombo: string;
  let redoKeyCombo: string;

  before(() => {
    const isMac = driver.isMac();
    undoKeyCombo = '{meta}z';
    redoKeyCombo = isMac ? '{meta}{shift}z' : '{meta}y';
    driver.beforeEach();
  });

  it("undo/redo", async () => {
    var styleObj;

    driver.setStyle('geojson');
    driver.openLayersModal();

    styleObj = await driver.getStyleStore();
    assert.deepEqual(styleObj.layers, []);

    driver.fillLayersModal({
      id: "step 1",
      type: "background"
    })

    styleObj = await driver.getStyleStore();
    assert.deepEqual(styleObj.layers, [
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

    styleObj = await driver.getStyleStore();
    assert.deepEqual(styleObj.layers, [
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
    styleObj = await driver.getStyleStore();
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    driver.typeKeys(undoKeyCombo)
    styleObj = await driver.getStyleStore();
    assert.deepEqual(styleObj.layers, [
    ]);

    driver.typeKeys(redoKeyCombo)
    styleObj = await driver.getStyleStore();
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    driver.typeKeys(redoKeyCombo)
    styleObj = await driver.getStyleStore();
    assert.deepEqual(styleObj.layers, [
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
