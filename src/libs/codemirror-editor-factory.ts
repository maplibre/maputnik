import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter, type Diagnostic } from "@codemirror/lint";
import { oneDark } from "@codemirror/theme-one-dark";
import { expression, type StylePropertySpecification, validateStyleMin } from "@maplibre/maplibre-gl-style-spec";
import jsonToAst, { type ValueNode, type PropertyNode } from "json-to-ast";
import { jsonPathToPosition } from "./json-path-to-position";

export type LintType = "layer" | "style" | "expression" | "json";

type LinterError = {
  key: string | null;
  message: string;
};

function getDiagnosticsFromExpressionErrors(errors: LinterError[], ast: ValueNode | PropertyNode) {
  const diagnostics: Diagnostic[] = [];
  for (const error of errors) {
    const {key, message} = error;
    if (!key) {
      diagnostics.push({
        from: 0,
        to: ast.loc ? ast.loc.end.offset : 0,
        severity: "error",
        message: message,
      });
    } else {
      const path = key.replace(/^\[|\]$/g, "").split(/\.|[[\]]+/).filter(Boolean);
      const node = jsonPathToPosition(path, ast);
      if (!node) {
        console.warn("Something went wrong parsing error:", error);
        continue;
      }
      if (node.loc) {
        diagnostics.push({
          from: node.loc.start.offset,
          to: node.loc.end.offset,
          severity: "error",
          message: message,
        });
      }
    }
  }
  return diagnostics;
}

function createMaplibreLayerLinter() {
  return (view: EditorView) => {
    const text = view.state.doc.toString();

    try {
      // Parse the JSON. The jsonParseLinter will handle pure JSON syntax errors.
      const parsedJson = JSON.parse(text);
      const ast = jsonToAst(text);

      // Run the maplibre-gl-style-spec validator.
      const validationErrors = validateStyleMin({
        "version": 8,
        "name": "Empty Style",
        "metadata": {},
        "sources": {},
        "sprite": "",
        "glyphs": "https://example.com/glyphs/{fontstack}/{range}.pbf",
        "layers": [
          parsedJson
        ]
      });

      const linterErrors = validationErrors
        .filter(err => {
          // Remove missing 'layer source' errors, because we don't include them
          return !err.message.match(/^layers\[0\]: source ".*" not found$/);
        })
        .map(err => {
          // Remove the 'layers[0].' as we're validating the layer only here
          const errMessageParts = err.message.replace(/^layers\[0\]./, "").split(":");
          return {
            key: errMessageParts[0],
            message: errMessageParts[1],
          };
        });
      return getDiagnosticsFromExpressionErrors(linterErrors, ast);
    } catch {
      // The built-in JSON linter handles JSON parsing errors, so we don't need to report them again.
    }
    return [];
  };
}

function createMaplibreStyleLinter() {
  return (view: EditorView) => {
    const text = view.state.doc.toString();

    try {
      // Parse the JSON. The jsonParseLinter will handle pure JSON syntax errors.
      const parsedJson = JSON.parse(text);
      const ast = jsonToAst(text);

      // Run the maplibre-gl-style-spec validator.
      const validationErrors = validateStyleMin(parsedJson);
      const linterErrors = validationErrors.map(err => {
        return {
          key: err.message.split(":")[0],
          message: err.message,
        };
      });
      return getDiagnosticsFromExpressionErrors(linterErrors, ast);
    } catch {
      // The built-in JSON linter handles JSON parsing errors, so we don't need to report them again.
    }
    return [];
  };
}

function createMaplibreExpressionLinter(spec?: StylePropertySpecification) {
  return (view: EditorView) => {
    const text = view.state.doc.toString();
    const parsedJson = JSON.parse(text);
    const ast = jsonToAst(text);
    const out = expression.createExpression(parsedJson, spec);
    if (out?.result !== "error") {
      return [];
    }
    const errors = out.value;
    return getDiagnosticsFromExpressionErrors(errors, ast);
  };
}

export function createEditor(props: {
  parent: HTMLElement,
  value: string,
  lintType: LintType,
  onChange: (value: string) => void,
  onFocus: () => void,
  onBlur: () => void,
  spec?: StylePropertySpecification,
}): EditorView {
  let specificLinter: (view: EditorView) => Diagnostic[] = () => [];
  switch (props.lintType) {
    case "style":
      specificLinter = createMaplibreStyleLinter();
      break;
    case "layer":
      specificLinter = createMaplibreLayerLinter();
      break;
    case "expression":
      specificLinter = createMaplibreExpressionLinter(props.spec);
      break;
    case "json":
      specificLinter = () => [];
      break;
  }

  return new EditorView({
    doc: props.value,
    extensions: [
      basicSetup,
      json(),
      oneDark,
      new Compartment().of(EditorState.tabSize.of(2)),
      EditorView.theme({
        "&": {
          fontSize: "9pt"
        }
      }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const doc = update.state.doc;
          const value = doc.toString();
          props.onChange(value);
        }
        if (update.focusChanged) {
          if (update.view.hasFocus) {
            props.onFocus();
          } else {
            props.onBlur();
          }
        }
      }),
      lintGutter(),
      linter((view: EditorView) => {
        const jsonErrors = jsonParseLinter()(view);
        if (jsonErrors.length > 0) {
          return jsonErrors;
        }
        return specificLinter(view);
      })
    ],
    parent: props.parent,
  });
}
