var assert = require("assert");
var config = require("../../config/specs");
var helper = require("../helper");



describe("history", function() {
  let undoKeyCombo;
  let undoKeyComboReset;
  let redoKeyCombo;
  let redoKeyComboReset;

  before(function() {
    const isMac = browser.execute(function() {
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
  it.skip("undo/redo", function() {
    var styleObj;

    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.acceptAlert();

    helper.modal.addLayer.open();

    styleObj = helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, []);

    helper.modal.addLayer.fill({
      id: "step 1",
      type: "background"
    })

    styleObj = helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    helper.modal.addLayer.open();
    helper.modal.addLayer.fill({
      id: "step 2",
      type: "background"
    })

    styleObj = helper.getStyleStore(browser);
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

    browser.keys(undoKeyCombo)
    browser.keys(undoKeyComboReset);
    styleObj = helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    browser.keys(undoKeyCombo)
    browser.keys(undoKeyComboReset);
    styleObj = helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
    ]);

    browser.keys(redoKeyCombo)
    browser.keys(redoKeyComboReset);
    styleObj = helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    browser.keys(redoKeyCombo)
    browser.keys(redoKeyComboReset);
    styleObj = helper.getStyleStore(browser);
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
