import style from './style'
import {loadStyleUrl} from './urlopen'
import publicSources from '../config/styles.json'
import { StyleSpecification } from '@maplibre/maplibre-gl-style-spec'

const storagePrefix = "maputnik"
const stylePrefix = 'style'
const storageKeys = {
  latest: [storagePrefix, 'latest_style'].join(':'),
  accessToken: [storagePrefix, 'access_token'].join(':')
}

const defaultStyleUrl = publicSources[0].url

// Fetch a default style via URL and return it or a fallback style via callback
export function loadDefaultStyle(cb: (...args: any[]) => void) {
  loadStyleUrl(defaultStyleUrl, cb)
}

// Return style ids and dates of all styles stored in local storage
function loadStoredStyles() {
  const styles = []
  for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if(isStyleKey(key!)) {
        styles.push(fromKey(key!))
      }
  }
  return styles
}

function isStyleKey(key: string) {
  const parts = key.split(":")
  return parts.length === 3 && parts[0] === storagePrefix && parts[1] === stylePrefix
}

// Load style id from key
function fromKey(key: string) {
  if(!isStyleKey(key)) {
    throw "Key is not a valid style key"
  }

  const parts = key.split(":")
  const styleId = parts[2]
  return styleId
}

// Calculate key that identifies the style with a version
function styleKey(styleId: string) {
  return [storagePrefix, stylePrefix, styleId].join(":")
}

// Manages many possible styles that are stored in the local storage
export class StyleStore {
  /**
   * List of style ids
   */
  mapStyles: string[];

  // Tile store will load all items from local storage and
  // assume they do not change will working on it
  constructor() {
    this.mapStyles = loadStoredStyles();
  }

  init(cb: (...args: any[]) => void) {
    cb(null)
  }

  // Delete entire style history
  purge() {
    for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i) as string;
        if(key.startsWith(storagePrefix)) {
          window.localStorage.removeItem(key)
        }
    }
  }

  // Find the last edited style
  latestStyle(cb: (...args: any[]) => void) {
    if(this.mapStyles.length === 0) return loadDefaultStyle(cb)
    const styleId = window.localStorage.getItem(storageKeys.latest) as string;
    const styleItem = window.localStorage.getItem(styleKey(styleId))

    if(styleItem) return cb(JSON.parse(styleItem))
    loadDefaultStyle(cb)
  }

  // Save current style replacing previous version
  save(mapStyle: StyleSpecification & { id: string }) {
    mapStyle = style.ensureStyleValidity(mapStyle)
    const key = styleKey(mapStyle.id)
    window.localStorage.setItem(key, JSON.stringify(mapStyle))
    window.localStorage.setItem(storageKeys.latest, mapStyle.id)
    return mapStyle
  }
}
