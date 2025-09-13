import {parse} from "@prantlf/jsonlint";
import CodeMirror, { MarkerRange } from "codemirror";
import jsonToAst from "json-to-ast";
import {expression, validateStyleMin} from "@maplibre/maplibre-gl-style-spec";

type MarkerRangeWithMessage = MarkerRange & {message: string};


CodeMirror.defineMode("mgl", (config, parserConfig) => {
  // Just using the javascript mode with json enabled. Our logic is in the linter below.
  return CodeMirror.modes.javascript(
    {...config, json: true} as any,
    parserConfig
  );
});


function tryToParse(text: string) {

  const found: MarkerRangeWithMessage[] = [];
  try {
    parse(text);
  }
  catch(err: any) {

    const errorMatch = err.toString().match(/line (\d+), column (\d+)/);
    if (errorMatch) {
      const loc = {
        first_line: parseInt(errorMatch[1], 10),
        first_column: parseInt(errorMatch[2], 10),
        last_line: parseInt(errorMatch[1], 10),
        last_column: parseInt(errorMatch[2], 10)
      };

      // const loc = hash.loc;
      found.push({
        from: CodeMirror.Pos(loc.first_line - 1, loc.first_column),
        to: CodeMirror.Pos(loc.last_line - 1, loc.last_column),
        message: err
      });
    }
  }

  return found;
}

CodeMirror.registerHelper("lint", "json", (text: string) => {
  return tryToParse(text);
});

CodeMirror.registerHelper("lint", "mgl", (text: string, opts: any, doc: any) => {

  const found: MarkerRangeWithMessage[] = tryToParse(text);

  const {context} = opts;

  if (found.length > 0) {
    // JSON invalid so don't go any further
    return found;
  }

  const ast = jsonToAst(text);
  const input = JSON.parse(text);

  function getArrayPositionalFromAst(node: any, path: string[]) {
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
        newNode = node.children.find((childNode: any) => {
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
      return getArrayPositionalFromAst(newNode, path.slice(1));
    }
  }

  let out: ReturnType<typeof expression.createExpression> | null = null;
  if (context === "layer") {
    // Just an empty style so we can validate a layer.
    const errors = validateStyleMin({
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
            return !err.message.match(/^layers\[0\]: source ".*" not found$/);
          })
          .map(err => {
            // Remove the 'layers[0].' as we're validating the layer only here
            const errMessageParts = err.message.replace(/^layers\[0\]./, "").split(":");
            return {
              name: "",
              key: errMessageParts[0],
              message: errMessageParts[1],
            };
          })
      };
    }
  }
  else if (context === "expression") {
    out = expression.createExpression(input, opts.spec);
  }
  else {
    throw new Error(`Invalid context ${context}`);
  }

  if (out?.result === "error") {
    const errors = out.value;
    errors.forEach(error => {
      const {key, message} = error;

      if (!key) {
        const lastLineHandle = doc.getLineHandle(doc.lastLine());
        const err = {
          from: CodeMirror.Pos(doc.firstLine(), 0),
          to: CodeMirror.Pos(doc.lastLine(), lastLineHandle.text.length),
          message: message,
        };
        found.push(err);
      }
      else if (key) {
        const path = key.replace(/^\[|\]$/g, "").split(/\.|[[\]]+/).filter(Boolean);
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
    });
  }

  return found;
});
