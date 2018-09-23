import style from './style.js'
import { loadStyleUrl } from './urlopen'
import publicSources from '../config/styles.json'

const storagePrefix = "maputnik"
const stylePrefix = 'style'
const storageKeys = {
  latest: [storagePrefix, 'latest_style'].join(':'),
  accessToken: [storagePrefix, 'access_token'].join(':')
}

const defaultStyleUrl = publicSources[0].url

// Fetch a default style via URL and return it or a fallback style via callback
export function loadDefaultStyle(cb) {
  loadStyleUrl(defaultStyleUrl, cb)
}

// Return style ids and dates of all styles stored in local storage
function loadStoredStyles() {
  const styles = []
  for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if(isStyleKey(key)) {
        styles.push(fromKey(key))
      }
  }
  return styles
}

function isStyleKey(key) {
  const parts = key.split(":")
  return parts.length == 3 && parts[0] === storagePrefix && parts[1] === stylePrefix
}

// Load style id from key
function fromKey(key) {
  if(!isStyleKey(key)) {
    throw "Key is not a valid style key"
  }

  const parts = key.split(":")
  const styleId = parts[2]
  return styleId
}

// Calculate key that identifies the style with a version
function styleKey(styleId) {
  return [storagePrefix, stylePrefix, styleId].join(":")
}

// Manages many possible styles that are stored in the local storage
export class StyleStore {
  // Tile store will load all items from local storage and
  // assume they do not change will working on it
  constructor() {
    this.mapStyles = loadStoredStyles()
  }

  init(cb) {
    cb(null)
  }

  // Delete entire style history
  purge() {
    for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i)
        if(key.startsWith(storagePrefix)) {
          window.localStorage.removeItem(key)
        }
    }
  }

  // Find the last edited style
  latestStyle(cb) {
    if(this.mapStyles.length === 0) return loadDefaultStyle(cb)
    const styleId = window.localStorage.getItem(storageKeys.latest)
    const styleItem = window.localStorage.getItem(styleKey(styleId))

    if(styleItem) return cb(JSON.parse(styleItem))
    loadDefaultStyle(cb)
  }

  // Save current style replacing previous version
  save(mapStyle) {
    mapStyle = style.ensureStyleValidity(mapStyle)
    const key = styleKey(mapStyle.id)
    window.localStorage.setItem(key, JSON.stringify(mapStyle))
    window.localStorage.setItem(storageKeys.latest, mapStyle.id)
    return mapStyle
  }
}
