/**
 * A unique id for the current document.
 */
let REF = 0;

export default function(prefix="") {
  REF++;
  return prefix+REF;
}
