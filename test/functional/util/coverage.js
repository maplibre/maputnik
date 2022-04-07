var artifacts   = require("../../artifacts");
var fs          = require("fs");
var istanbulCov = require('istanbul-lib-coverage');

var COVERAGE_PATH = artifacts.pathSync("/coverage");


var coverage = istanbulCov.createCoverageMap({});

// Capture the coverage after each test
afterEach(async function() {
  // Code coverage
  var results = await browser.execute(function() {
    return window.__coverage__;
  });

  if (results) {
    coverage.merge(results);
  }
})

// Dump the coverage to a file
after(function() {

  // Sometimes istanbul copies same location entry with null values
  // crashing the final coverage step. This is just a workaround for now,
  // since istanbul will be replaced by nyc.
  const coverageJson = JSON.stringify(coverage, null, 2);
  let newCoverage = JSON.parse(coverageJson);

  Object.values(newCoverage).forEach(fileCov => {
    if (fileCov.branchMap) {
      Object.values(fileCov.branchMap).forEach(branchMapEntry => {
        let prevLocation = {};
        branchMapEntry.locations.forEach(curLocation => {
          if (curLocation.start && curLocation.end &&
            curLocation.start.column && curLocation.start.line &&
            curLocation.end.column && curLocation.end.line)
            {
              prevLocation = curLocation;
            }
            else
            {
              curLocation.start.column = prevLocation.start.column;
              curLocation.start.line = prevLocation.start.line;
              curLocation.end.column = prevLocation.end.column;
              curLocation.end.line = prevLocation.end.line;
            }
        })
      })
    }
  })

  const newCoverageJson = JSON.stringify(newCoverage, null, 2);
  fs.writeFileSync(COVERAGE_PATH+"/coverage.json", newCoverageJson);
})
