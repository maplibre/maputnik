var artifacts = require("../../artifacts");
var fs        = require("fs");
var path      = require("path");


browser.setTimeout({ 'script': 20*1000 });
browser.setTimeout({ 'implicit': 20*1000 });

var SCREENSHOTS_PATH = artifacts.pathSync("/screenshots");

/**
 * Sometimes chrome driver can result in the wrong text.
 *
 * See <https://github.com/webdriverio/webdriverio/issues/1886>
 */
try {
  browser.addCommand('setValueSafe', function(selector, text) {
    for(var i=0; i<10; i++) {
      const elem = $(selector);
      elem.waitForDisplayed(500);

      var elements = browser.findElements("css selector", selector);
      if(elements.length > 1) {
        throw "Too many elements found";
      }

      const elem2 = $(selector);
      elem2.setValue(text);

      var browserText = elem2.getValue();

      if(browserText == text) {
        return;
      }
      else {
        console.error("Warning: setValue failed, trying again");
      }
    }

    // Wait for change events to fire and state updated
    browser.flushReactUpdates();
  })

  browser.addCommand('takeScreenShot', function(filepath) {
    var savepath = path.join(SCREENSHOTS_PATH, filepath);
    browser.saveScreenshot(savepath);
  });

  browser.addCommand('flushReactUpdates', function() {
    browser.executeAsync(function(done) {
      // For any events to propogate
      setTimeout(function() {
        // For the DOM to be updated.
        setTimeout(done, 0);
      }, 0)
    })
  })

} catch(err) {
  console.error(">>> Ignored error: "+err);
}
