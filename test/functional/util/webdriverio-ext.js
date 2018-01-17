browser.timeoutsAsyncScript(20*1000);
browser.timeoutsImplicitWait(20*1000);

/**
 * Sometimes chrome driver can result in the wrong text.
 *
 * See <https://github.com/webdriverio/webdriverio/issues/1886>
 */
try {
  browser.addCommand('setValueSafe', function(selector, text) {
    for(var i=0; i<10; i++) {
      browser.waitForVisible(selector);

      var elements = browser.elements(selector);
      if(elements.length > 1) {
        throw "Too many elements found";
      }

      browser.setValue(selector, text);
      var browserText = browser.getValue(selector);

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
    var data = browser.screenshot();
    fs.writeFileSync(path.join(SCREENSHOTS_PATH, filepath), data.value, 'base64');
  });

  browser.addCommand('flushReactUpdates', function() {
    browser.executeAsync(function(done) {
      // For any events to propogate
      setImmediate(function() {
        // For the DOM to be updated.
        setImmediate(done);
      })
    })
  })

} catch(err) {
  console.error(">>> Ignored error: "+err);
}
