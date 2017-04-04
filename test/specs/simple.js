var assert = require('assert');
var config = require("../config/specs");


describe('maputnik', function() {

  it('check logo exists', function () {
    browser.url(config.baseUrl);
    browser.waitForExist(".maputnik-toolbar-link");

    var src = browser.getAttribute(".maputnik-toolbar-link img", "src");
    assert.equal(src, config.baseUrl+'/img/maputnik.png');
  });

});
