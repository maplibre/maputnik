/**
 * A unique id for the current document.
 */
let REF = 0;

export default function generateUniqueId(prefix = "") {
  REF++;
  return prefix + REF;
}
