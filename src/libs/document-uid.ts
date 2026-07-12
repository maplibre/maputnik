/**
 * A unique id for the current document.
 */
let REF = 0;

export function generateUniqueId(prefix="") {
  REF++;
  return prefix+REF;
}
