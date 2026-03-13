/**
 * Sidebar resize helpers.
 *
 * Extracted from AppLayout so they can be tested independently and
 * reused if needed elsewhere.
 */

export const DEFAULT_LIST_WIDTH = 200;
export const DEFAULT_DRAWER_WIDTH = 370;
export const DEFAULT_SIDEBAR_WIDTH = DEFAULT_LIST_WIDTH + DEFAULT_DRAWER_WIDTH;
export const MIN_SIDEBAR_WIDTH = 280;
export const MAX_SIDEBAR_WIDTH = 800;
export const MIN_LIST_WIDTH = 100;
export const MIN_DRAWER_WIDTH = 150;
export const DEFAULT_LIST_RATIO = DEFAULT_LIST_WIDTH / DEFAULT_SIDEBAR_WIDTH;

const STORAGE_KEY = "maputnik:sidebarWidth";
const RATIO_STORAGE_KEY = "maputnik:listRatio";

/** Read the persisted sidebar width from localStorage (if valid). */
export function getSavedSidebarWidth(): number | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const val = parseInt(saved, 10);
      if (!isNaN(val) && val >= MIN_SIDEBAR_WIDTH && val <= MAX_SIDEBAR_WIDTH) {
        return val;
      }
    }
  } catch {
    // localStorage may be unavailable
  }
  return null;
}

/** Persist the sidebar width to localStorage. */
export function saveSidebarWidth(width: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(width));
  } catch {
    // ignore
  }
}

/** Read the persisted list/drawer ratio from localStorage (if valid). */
export function getSavedListRatio(): number | null {
  try {
    const saved = localStorage.getItem(RATIO_STORAGE_KEY);
    if (saved) {
      const val = parseFloat(saved);
      if (!isNaN(val) && val >= 0.1 && val <= 0.9) {
        return val;
      }
    }
  } catch {
    // localStorage may be unavailable
  }
  return null;
}

/** Persist the list/drawer ratio to localStorage. */
export function saveListRatio(ratio: number): void {
  try {
    localStorage.setItem(RATIO_STORAGE_KEY, String(ratio));
  } catch {
    // ignore
  }
}

/** Clamp a width value to the allowed sidebar range. */
export function clampSidebarWidth(width: number): number {
  return Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, width));
}
