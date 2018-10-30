var assert = require("assert");
var config = require("../../config/specs");
var helper = require("../helper");


describe.skip("history", function() {
  /**
   * See <https://github.com/webdriverio/webdriverio/issues/1126>
   */
  it("undo/redo", function() {
    var styleObj;

    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));
    browser.alertAccept();

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

    browser
      .keys(['Control', 'z'])
      .keys(['Control']);
    styleObj = helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    browser
      .keys(['Control', 'z'])
      .keys(['Control']);
    styleObj = helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
    ]);

    browser
      .keys(['Control', 'y'])
      .keys(['Control']);
    styleObj = helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    browser
      .keys(['Control', 'y'])
      .keys(['Control']);
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
