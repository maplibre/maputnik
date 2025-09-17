import { type PropertyNode, type ValueNode } from "json-to-ast";

export function jsonPathToPosition(path: string[], node: ValueNode | PropertyNode | undefined,) {
  if (!node) {
    return undefined;
  }
  if (path.length < 1) {
    return node;
  }
  if (!("children" in node)) {
    return undefined;
  }
  const key = path[0];
  if (key.match(/^[0-9]+$/)) {
    return jsonPathToPosition(path.slice(1), node.children[+path[0]]);
  }
  const newNode = node.children.find((childNode) => {
    return (
      "key" in childNode &&
      childNode.key.type === "Identifier" &&
      childNode.key.value === key
    );
  }) as PropertyNode | undefined;
  return jsonPathToPosition(path.slice(1), newNode?.value);
}
