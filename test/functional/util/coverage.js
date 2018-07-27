var artifacts   = require("../../artifacts");
var fs          = require("fs");
var istanbulCov = require('istanbul-lib-coverage');

var COVERAGE_PATH = artifacts.pathSync("/coverage");


var coverage = istanbulCov.createCoverageMap({});

// Capture the coverage after each test
afterEach(function() {
  // Code coverage
  var results = browser.execute(function() {
    return window.__coverage__;
  });

  coverage.merge(results.value);
})

// Dump the coverage to a file
after(function() {
  var jsonStr = JSON.stringify(coverage, null, 2);
  fs.writeFileSync(COVERAGE_PATH+"/coverage.json", jsonStr);
})
