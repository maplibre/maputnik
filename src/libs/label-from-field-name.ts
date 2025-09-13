import capitalize from "lodash.capitalize";

export default function labelFromFieldName(fieldName: string) {
  let label: string;
  const parts = fieldName.split("-");
  if (parts.length > 1) {
    label = fieldName.split("-").slice(1).join(" ");
  } else {
    label = fieldName;
  }
  return capitalize(label);
}
