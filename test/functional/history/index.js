var assert = require("assert");
var config = require("../../config/specs");
var helper = require("../helper");
var wd     = require("../../wd-helper");


describe.skip("history", function() {
  /**
   * See <https://github.com/webdriverio/webdriverio/issues/1126>
   */
  it("undo/redo", function() {
    var styleObj;

    browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
      "geojson:example"
    ]));

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


  // /**
  //  * See <https://github.com/webdriverio/webdriverio/issues/1126>
  //  */
  // it("undo/redo", function() {
  //   var styleObj;

  //   browser.debug();

  //   browser.url(helper.config.baseUrl+"?debug&style="+helper.getStyleUrl([
  //     "geojson:example"
  //   ]));
  //   browser.waitForExist(".maputnik-toolbar-link");

  //   helper.modalCommands.addLayer.open(browser);

  //   styleObj = helper.helper.getStyleStore(browser);
  //   assert.deepEqual(styleObj.layers, []);

  //   helper.modalCommands.addLayer.fill(browser, {
  //     id: "step 1",
  //     type: "background"
  //   })

  //   styleObj = helper.helper.getStyleStore(browser);
  //   assert.deepEqual(styleObj.layers, [
  //     {
  //       "id": "step 1",
  //       "type": 'background'
  //     }
  //   ]);

  //   helper.modalCommands.addLayer.open(browser);
  //   helper.modalCommands.addLayer.fill(browser, {
  //     id: "step 2",
  //     type: "background"
  //   })

  //   styleObj = helper.helper.getStyleStore(browser);
  //   assert.deepEqual(styleObj.layers, [
  //     {
  //       "id": "step 1",
  //       "type": 'background'
  //     },
  //     {
  //       "id": "step 2",
  //       "type": 'background'
  //     }
  //   ]);

  //   browser
  //     .keys(['Control', 'z'])
  //     .keys(['Control']);
  //   styleObj = helper.helper.getStyleStore(browser);
  //   assert.deepEqual(styleObj.layers, [
  //     {
  //       "id": "step 1",
  //       "type": 'background'
  //     }
  //   ]);

  //   browser
  //     .keys(['Control', 'z'])
  //     .keys(['Control']);
  //   styleObj = helper.helper.getStyleStore(browser);
  //   assert.deepEqual(styleObj.layers, [
  //   ]);

  //   browser
  //     .keys(['Control', 'y'])
  //     .keys(['Control']);
  //   styleObj = helper.helper.getStyleStore(browser);
  //   assert.deepEqual(styleObj.layers, [
  //     {
  //       "id": "step 1",
  //       "type": 'background'
  //     }
  //   ]);

  //   browser
  //     .keys(['Control', 'y'])
  //     .keys(['Control']);
  //   styleObj = helper.helper.getStyleStore(browser);
  //   assert.deepEqual(styleObj.layers, [
  //     {
  //       "id": "step 1",
  //       "type": 'background'
  //     },
  //     {
  //       "id": "step 2",
  //       "type": 'background'
  //     }
  //   ]);

  // })
})
