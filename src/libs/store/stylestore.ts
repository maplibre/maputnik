import publicSources from "../../config/styles.json";
import type { IStyleStore, StyleSpecificationWithId } from "../definitions";
import style from "../style";
import { loadStyleUrl } from "../urlopen";

const storagePrefix = "maputnik";
const stylePrefix = "style";
const storageKeys = {
  latest: [storagePrefix, "latest_style"].join(":"),
  accessToken: [storagePrefix, "access_token"].join(":"),
};

const defaultStyleUrl = publicSources[0].url;

// Fetch a default style via URL and return it or a fallback style via callback
export function loadDefaultStyle(): Promise<StyleSpecificationWithId> {
  return loadStyleUrl(defaultStyleUrl);
}

// Return style ids and dates of all styles stored in local storage
function loadStoredStyles() {
  const styles = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (isStyleKey(key!)) {
      styles.push(fromKey(key!));
    }
  }
  return styles;
}

function isStyleKey(key: string) {
  const parts = key.split(":");
  return (
    parts.length === 3 && parts[0] === storagePrefix && parts[1] === stylePrefix
  );
}

// Load style id from key
function fromKey(key: string) {
  if (!isStyleKey(key)) {
    throw "Key is not a valid style key";
  }

  const parts = key.split(":");
  const styleId = parts[2];
  return styleId;
}

// Calculate key that identifies the style with a version
function styleKey(styleId: string) {
  return [storagePrefix, stylePrefix, styleId].join(":");
}

// Manages many possible styles that are stored in the local storage
export class StyleStore implements IStyleStore {
  /**
   * List of style ids
   */
  mapStyles: string[];

  // Tile store will load all items from local storage and
  // assume they do not change will working on it
  constructor() {
    this.mapStyles = loadStoredStyles();
  }

  // Delete entire style history
  purge() {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i) as string;
      if (key.startsWith(storagePrefix)) {
        window.localStorage.removeItem(key);
      }
    }
  }

  // Find the last edited style
  async getLatestStyle(): Promise<StyleSpecificationWithId> {
    if (this.mapStyles.length === 0) {
      return loadDefaultStyle();
    }
    const styleId = window.localStorage.getItem(storageKeys.latest) as string;
    const styleItem = window.localStorage.getItem(styleKey(styleId));

    if (styleItem) {
      return JSON.parse(styleItem) as StyleSpecificationWithId;
    }
    return loadDefaultStyle();
  }

  // Save current style replacing previous version
  save(mapStyle: StyleSpecificationWithId) {
    mapStyle = style.ensureStyleValidity(mapStyle);
    const key = styleKey(mapStyle.id);

    const saveFn = () => {
      window.localStorage.setItem(key, JSON.stringify(mapStyle));
      window.localStorage.setItem(storageKeys.latest, mapStyle.id);
    };

    try {
      saveFn();
    } catch (e) {
      // Handle quota exceeded error
      if (
        e instanceof DOMException &&
        (e.code === 22 || // Firefox
          e.code === 1014 || // Firefox
          e.name === "QuotaExceededError" ||
          e.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        this.purge();
        saveFn(); // Retry after clearing
      } else {
        throw e;
      }
    }
    return mapStyle;
  }
}
