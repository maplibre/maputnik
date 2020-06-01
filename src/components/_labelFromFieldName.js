import capitalize from 'lodash.capitalize'

export default function labelFromFieldName(fieldName) {
  let label;
  const parts = fieldName.split('-');
  if (parts.length > 1) {
    label = fieldName.split('-').slice(1).join(' ');
  }
  else {
    label = fieldName;
  }
  return capitalize(label);
}
