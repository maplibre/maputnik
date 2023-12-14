var {v1: uuid} = require('uuid');
var fs = require("fs");
var path = require("path");
var config = require("../config/specs");
var geoServer = require("../geojson-server");
var artifacts = require("../artifacts");

var SCREENSHOTS_PATH = artifacts.pathSync("/screenshots");

var testNetwork = process.env.TEST_NETWORK || "localhost";
var geoserver;


const driver = {
    geoserver: {
      start(done) {
        geoserver = geoServer.listen(9002, "0.0.0.0", done);
      },
      stop(done) {
        geoserver.close(done);
        geoserver = undefined;
      },
    },
    getStyleUrl(styles) {
      var port = geoserver.address().port;
      return "http://"+testNetwork+":"+port+"/styles/empty/"+styles.join(",");
    },
    getGeoServerUrl(urlPath) {
      var port = geoserver.address().port;
      return "http://"+testNetwork+":"+port+"/"+urlPath;
    },

    async setStyle(styleProperties, zoom) {
      let url = config.baseUrl + "?debug";
      if (styleProperties && Array.isArray(styleProperties)) {
        url += "&style=" + this.getStyleUrl(styleProperties);
      } else if (styleProperties && typeof styleProperties === "string") {
        url += "&style=" + this.getGeoServerUrl(styleProperties);
      }
      if (zoom) {
        url += "#" + zoom + "/41.3805/2.1635";
      }
      await browser.url(url);
      if (styleProperties) {
        await browser.acceptAlert();
      }
      await this.waitForExist(".maputnik-toolbar-link");
      await this.zeroTimeout();
    },
    async getStyleStore() {
      return await browser.executeAsync(function(done) {
        window.debug.get("maputnik", "styleStore").latestStyle(done);
      });
    },
    async setSurvey() {
      await browser.execute(function() {
        localStorage.setItem("survey", true);
      });
    },
    async isMac() {
      return await browser.execute(function() {
        return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      });
    },
    async typeKeys(keys) {
      await browser.keys(keys)
    },
    async click(selector) {
      const elem = await $(selector);
      await elem.click();
    },
    async selectFromDropdown(selector, value) {
      const selectBox = await $(selector);
      await selectBox.selectByAttribute('value', value);
      await this.zeroTimeout();
    },
    async isDisplayedInViewport(selector) {
      const elem = await $(selector);
      return elem.isDisplayedInViewport();
    },
    async isFocused(selector) {
      const elem = await $(selector);
      return elem.isFocused();
    },
    /**
     * Sometimes chrome driver can result in the wrong text.
     *
     * See <https://github.com/webdriverio/webdriverio/issues/1886>
     */
    async setValue(selector, text) {
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
      await this.zeroTimeout();
    },
    getExampleFilePath() {
      return __dirname + "/../example-style.json";
    },
    async getExampleFileData() {
      var styleFilePath = this.getExampleFilePath();
      return JSON.parse(fs.readFileSync(styleFilePath));
    },
    async chooseExampleFile() {
      const elem = await $("*[type='file']");
      await elem.waitForExist();
      await browser.chooseFile("*[type='file']", this.getExampleFilePath());
    },
    async zeroTimeout() {
      await browser.executeAsync(function (done) {
        // For any events to propagate
        setTimeout(function () {
          // For the DOM to be updated.
          setTimeout(done, 0);
        }, 0)
      })
    },
    async sleep(milliseconds) {
      await browser.pause(milliseconds);
    },
    async isExisting(selector) {
      const elem = await $(selector);
      return elem.isExisting();
    },
    async waitForExist(selector) {
      const elem = await $(selector);
      await elem.waitForExist();
    },
    async setWindowSize(height, width) {
      await browser.setWindowSize(height, width);
    },
    async takeScreenShot(filepath) {
      var savepath = path.join(SCREENSHOTS_PATH, filepath);
      await browser.saveScreenshot(savepath);
    },
    getDataAttribute(key, selector) {
      selector = selector || "";
      return "*[data-wd-key='"+key+"'] "+selector;
    },
    async openLayersModal() {
      const selector = await $(this.getDataAttribute('layer-list:add-layer'));
      await selector.click();

      // Wait for events
      await this.zeroTimeout();

      const elem = await $(this.getDataAttribute('modal:add-layer'));
      await elem.waitForExist();
      await elem.isDisplayed();
      await elem.isDisplayedInViewport();

      // Wait for events
      await this.zeroTimeout();
    },
    async fillLayersModal(opts) {
      var type = opts.type;
      var layer = opts.layer;
      var id;
      if(opts.id) {
        id = opts.id
      }
      else {
        id = type+":"+uuid();
      }

      const selectBox = await $(this.getDataAttribute("add-layer.layer-type", "select"));
      await selectBox.selectByAttribute('value', type);
      await this.zeroTimeout();

      await this.setValue(this.getDataAttribute("add-layer.layer-id", "input"), id);
      if(layer) {
        await this.setValue(this.getDataAttribute("add-layer.layer-source-block", "input"), layer);
      }

      await this.zeroTimeout();
      const elem_addLayer = await $(this.getDataAttribute("add-layer"));
      await elem_addLayer.click();

      return id;
    },

    async closeModal(wdKey) {
      const selector = this.getDataAttribute(wdKey);
    
      await browser.waitUntil(async function() {
        const elem = await $(selector);
        return await elem.isDisplayedInViewport();
      });
    
      await this.click(this.getDataAttribute(wdKey+".close-modal"));
    
      await browser.waitUntil(async function() {
        return await browser.execute((selector) => {
          return !document.querySelector(selector);
        }, selector);
      });
    }
}
module.exports = driver;