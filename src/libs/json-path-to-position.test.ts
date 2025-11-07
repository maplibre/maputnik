import jsonToAst from "json-to-ast";
import { describe, it, expect } from "vitest";
import { jsonPathToPosition } from "./json-path-to-position";

describe("json-path-to-position", () => {
  it("should get position of a simple key", () => {
    const json = {
      "key1": "value1",
      "key2": "value2"
    };
    const text = JSON.stringify(json);
    const ast = jsonToAst(text);
    const node = jsonPathToPosition(["key1"], ast);
    expect(text.slice(node!.loc!.start.offset, node!.loc!.end.offset)).toBe('"value1"');
  });

  it("should get position of second key", () => {
    const json = {
      "key1": "value1",
      "key2": "value2"
    };
    const text = JSON.stringify(json);
    const ast = jsonToAst(text);
    const node = jsonPathToPosition(["key2"], ast);
    expect(text.slice(node!.loc!.start.offset, node!.loc!.end.offset)).toBe('"value2"');
  });

  it("should get position key in array", () => {
    const json = {
      "layers": [
        {
          "id": "layer1"
        }, {
          "id": "layer2"
        }
      ]
    };
    const text = JSON.stringify(json);
    const ast = jsonToAst(text);
    const node = jsonPathToPosition(["layers", "1", "id"], ast);
    expect(text.slice(node!.loc!.start.offset, node!.loc!.end.offset)).toBe('"layer2"');
  });

  it("should return undefined when key does not exist", () => {
    const json = {
      "layers": [
        {
          "id": "layer1"
        }, {
          "id": "layer2"
        }
      ]
    };
    const text = JSON.stringify(json);
    const ast = jsonToAst(text);
    const node = jsonPathToPosition(["layers", "2", "id"], ast);
    expect(node).toBe(undefined);
  });

  it("should return undefined for value type", () => {
    const json = 1;
    const text = JSON.stringify(json);
    const ast = jsonToAst(text);
    const node = jsonPathToPosition(["id"], ast);
    expect(node).toBe(undefined);
  });
});
