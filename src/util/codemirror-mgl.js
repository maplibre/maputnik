import jsonlint from 'jsonlint';
import CodeMirror from 'codemirror';
import jsonToAst from 'json-to-ast';
import {expression, validate, latest} from '@mapbox/mapbox-gl-style-spec';


CodeMirror.defineMode("mgl", function(config, parserConfig) {
  // Just using the javascript mode with json enabled. Our logic is in the linter below.
  return CodeMirror.modes.javascript(
    {...config, json: true},
    parserConfig
  );
});

CodeMirror.registerHelper("lint", "json", function(text) {
  const found = [];

  // NOTE: This was modified from the original to remove the global, also the
  // old jsonlint API was 'jsonlint.parseError' its now
  // 'jsonlint.parser.parseError'
  jsonlint.parser.parseError = function(str, hash) {
    const loc = hash.loc;
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

CodeMirror.registerHelper("lint", "mgl", function(text, opts, doc) {
  const found = [];
  const {parser} = jsonlint;
  const {context} = opts;

  parser.parseError = function(str, hash) {
    const loc = hash.loc;
    found.push({
      from: CodeMirror.Pos(loc.first_line - 1, loc.first_column),
      to: CodeMirror.Pos(loc.last_line - 1, loc.last_column),
      message: str
    });
  };
  try {
    parser.parse(text);
  }
  catch (e) {}

  if (found.length > 0) {
    // JSON invalid so don't go any further
    return found;
  }

  const ast = jsonToAst(text);
  const input = JSON.parse(text);

  function getArrayPositionalFromAst (node, path) {
    if (!node) {
      return undefined;
    }
    else if (path.length < 1) {
      return node;
    }
    else if (!node.children) {
      return undefined;
    }
    else {
      const key = path[0];
      let newNode;
      if (key.match(/^[0-9]+$/)) {
        newNode = node.children[path[0]];
      }
      else {
        newNode = node.children.find(childNode => {
          return (
            childNode.key &&
            childNode.key.type === "Identifier" &&
            childNode.key.value === key
          );
        });
        if (newNode) {
          newNode = newNode.value;
        }
      }
      return getArrayPositionalFromAst(newNode, path.slice(1))
    }
  }

  let out;
  if (context === "layer") {
    // Just an empty style so we can validate a layer.
    const errors = validate({
      "version": 8,
      "name": "Empty Style",
      "metadata": {},
      "sources": {},
      "sprite": "",
      "glyphs": "https://example.com/glyphs/{fontstack}/{range}.pbf",
      "layers": [
        input
      ]
    });

    if (errors) {
      out = {
        result: "error",
        value: errors
          .filter(err => {
            // Remove missing 'layer source' errors, because we don't include them
            if (err.message.match(/^layers\[0\]: source ".*" not found$/)) {
              return false;
            }
            else {
              return true;
            }
          })
          .map(err => {
            // Remove the 'layers[0].' as we're validating the layer only here
            const errMessageParts = err.message.replace(/^layers\[0\]./, "").split(":");
            return {
              key: errMessageParts[0],
              message: errMessageParts[1],
            };
          })
      }
    }
  }
  else if (context === "expression") {
    out = expression.createExpression(input, opts.spec);
  }
  else {
    throw new Error(`Invalid context ${context}`);
  }

  if (out.result === "error") {
    const errors = out.value;
    errors.forEach(error => {
      const {key, message} = error;

      if (!key) {
        const lastLineHandle = doc.getLineHandle(doc.lastLine());
        const err = {
          from: CodeMirror.Pos(doc.firstLine(), 0),
          to: CodeMirror.Pos(doc.lastLine(), lastLineHandle.text.length),
          message: message,
        }
        found.push(err);
      }
      else if (key) {
        const path = key.replace(/^\[|\]$/g, "").split(/\.|[\[\]]+/).filter(Boolean)
        const parsedError = getArrayPositionalFromAst(ast, path);
        if (!parsedError) {
          console.warn("Something went wrong parsing error:", error);
          return;
        }

        const {loc} = parsedError;
        const {start, end} = loc;

        found.push({
          from: CodeMirror.Pos(start.line - 1, start.column),
          to: CodeMirror.Pos(end.line - 1, end.column),
          message: message,
        });
      }
    })
  }

  return found;
});
