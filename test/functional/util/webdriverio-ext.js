var artifacts = require("../../artifacts");
var path = require("path");

const extendWebdriverIO = async function() {
  await browser.setTimeout({ 'script': 20 * 1000 });
  await browser.setTimeout({ 'implicit': 20 * 1000 });

  var SCREENSHOTS_PATH = artifacts.pathSync("/screenshots");

  /**
   * Sometimes chrome driver can result in the wrong text.
   *
   * See <https://github.com/webdriverio/webdriverio/issues/1886>
   */
  try {
    await browser.addCommand('setValueSafe', async function (selector, text) {
      for (var i = 0; i < 10; i++) {
        const elem = await $(selector);
        await elem.waitForDisplayed(500);

        var elements = await browser.findElements("css selector", selector);
        if (elements.length > 1) {
          throw "Too many elements found";
        }

        const elem2 = await $(selector);
        await elem2.setValue(text);

        var browserText = await elem2.getValue();

        if (browserText == text) {
          return;
        }
        else {
          console.error("Warning: setValue failed, trying again");
        }
      }

      // Wait for change events to fire and state updated
      await browser.flushReactUpdates();
    })

    await browser.addCommand('takeScreenShot', async function (filepath) {
      var savepath = path.join(SCREENSHOTS_PATH, filepath);
      await browser.saveScreenshot(savepath);
    });

    await browser.addCommand('flushReactUpdates', async function () {
      await browser.executeAsync(function (done) {
        // For any events to propagate
        setTimeout(function () {
          // For the DOM to be updated.
          setTimeout(done, 0);
        }, 0)
      })
    })

  } catch (err) {
    console.error(">>> Ignored error: " + err);
  }
}

module.exports = extendWebdriverIO;