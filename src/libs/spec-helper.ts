/**
 * If we don't have a default value just make one up
 */
export function findDefaultFromSpec(spec: {
  type: "string" | "color" | "boolean" | "array";
  default?: any;
}) {
  if (Object.hasOwn(spec, "default")) {
    return spec.default;
  }

  const defaults = {
    color: "#000000",
    string: "",
    boolean: false,
    number: 0,
    array: [],
  };

  return defaults[spec.type] || "";
}
