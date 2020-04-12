/**
 * If we don't have a default value just make one up
 */
export function findDefaultFromSpec (spec) {
  if (spec.hasOwnProperty('default')) {
    return spec.default;
  }

  const defaults = {
    'color': '#000000',
    'string': '',
    'boolean': false,
    'number': 0,
    'array': [],
  }

  return defaults[spec.type] || '';
}
