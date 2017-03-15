// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Depends on fork of jsonlint from <https://github.com/josdejong/jsonlint>
// becuase of <https://github.com/zaach/jsonlint/issues/57>
var jsonlint   = require("jsonlint");
var CodeMirror = require("codemirror");

CodeMirror.registerHelper("lint", "json", function(text) {
  var found = [];

  // NOTE: This was modified from the original to remove the global, also the
  // old jsonlint API was 'jsonlint.parseError' its now
  // 'jsonlint.parser.parseError'
  jsonlint.parser.parseError = function(str, hash) {
    var loc = hash.loc;
    found.push({
      from:    CodeMirror.Pos(loc.first_line - 1, loc.first_column),
      to:      CodeMirror.Pos(loc.last_line  - 1, loc.last_column),
      message: str
    });
  };

  try {
    jsonlint.parse(text);
  }
  catch(e) {
    // Do nothing we catch the error above
  }
  return found;
});
