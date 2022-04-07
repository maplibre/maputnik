var assert = require("assert");
var config = require("../../config/specs");
var helper = require("../helper");



describe("history", function() {
  let undoKeyCombo;
  let undoKeyComboReset;
  let redoKeyCombo;
  let redoKeyComboReset;

  before(async function() {
    const isMac = await browser.execute(function() {
      return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    });
    undoKeyCombo = ['Meta', 'z'];
    undoKeyComboReset = ['Meta'];
    redoKeyCombo = isMac ? ['Meta', 'Shift', 'z'] : ['Meta', 'y'];
    redoKeyComboReset = isMac ? ['Meta', 'Shift'] : ['Meta'];
  });

  /**
   * See <https://github.com/webdriverio/webdriverio/issues/1126>
   */
  it.skip("undo/redo", async function() {
    var styleObj;

    await browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    await browser.acceptAlert();

    await helper.modal.addLayer.open();

    styleObj = await helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, []);

    await helper.modal.addLayer.fill({
      id: "step 1",
      type: "background"
    })

    styleObj = await helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    await helper.modal.addLayer.open();
    await helper.modal.addLayer.fill({
      id: "step 2",
      type: "background"
    })

    styleObj = await helper.getStyleStore(browser);
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

    await browser.keys(undoKeyCombo)
    await browser.keys(undoKeyComboReset);
    styleObj = await helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    await browser.keys(undoKeyCombo)
    await browser.keys(undoKeyComboReset);
    styleObj = await helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
    ]);

    await browser.keys(redoKeyCombo)
    await browser.keys(redoKeyComboReset);
    styleObj = await helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    await browser.keys(redoKeyCombo)
    await browser.keys(redoKeyComboReset);
    styleObj = await helper.getStyleStore(browser);
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
