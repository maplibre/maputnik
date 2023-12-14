var driver    = require("../driver");


// These will get used in the marketing material. They are also useful to do a quick manual check of the styling across browsers
// NOTE: These duplicate some of the tests, however this is indended becuase it's likely these will change for aesthetic reasons over time
describe('screenshots', function() {

  beforeEach(async function() {
    await driver.setWindowSize(1280, 800)
  })

  it("front_page", async function() {
    await driver.setStyle(["geojson:example"]);

    await driver.takeScreenShot("/front_page.png")
  })

  it("open", async function() {
    await driver.setStyle(["geojson:example"]);
    await driver.click(driver.getDataAttribute("nav:open"));
    await driver.zeroTimeout();

    await driver.takeScreenShot("/open.png")
  })

  it("export", async function() {
    await driver.setStyle(["geojson:example"]);

    await driver.click(driver.getDataAttribute("nav:export"));
    await driver.zeroTimeout();

    await driver.takeScreenShot("/export.png")
  })

  it("sources", async function() {
    await driver.setStyle(["geojson:example"]);

    await driver.click(driver.getDataAttribute("nav:sources"));
    await driver.zeroTimeout();

    await driver.takeScreenShot("/sources.png")
  })

  it("style settings", async function() {
    await driver.setStyle(["geojson:example"]);

    await driver.click(driver.getDataAttribute("nav:settings"));
    await driver.zeroTimeout();

    await driver.takeScreenShot("/settings.png")
  })

  it("inspect", async function() {
    await driver.setStyle(["geojson:example"]);

    await driver.selectFromDropdown(driver.getDataAttribute("nav:inspect", "select"), 'inspect');
    await driver.zeroTimeout();

    await driver.takeScreenShot("/inspect.png")
  })
})

