import React from 'react';
import deref from '@mapbox/mapbox-gl-style-spec/deref'
import tokens from '../config/tokens.json'

// Empty style is always used if no style could be restored or fetched
const emptyStyle = ensureStyleValidity({
  version: 8,
  sources: {},
  layers: [],
})

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

function ensureHasId(style) {
  if('id' in style) return style
  style.id = generateId()
  return style
}

function ensureHasNoInteractive(style) {
  const changedLayers = style.layers.map(layer => {
    const changedLayer = { ...layer }
    delete changedLayer.interactive
    return changedLayer
  })

  const nonInteractiveStyle = {
    ...style,
    layers: changedLayers
  }
  return nonInteractiveStyle
}

function ensureHasNoRefs(style) {
  const derefedStyle = {
    ...style,
    layers: deref(style.layers)
  }
  return derefedStyle
}

function ensureStyleValidity(style) {
  return ensureHasNoInteractive(ensureHasNoRefs(ensureHasId(style)))
}

function indexOfLayer(layers, layerId) {
  for (let i = 0; i < layers.length; i++) {
    if(layers[i].id === layerId) {
      return i
    }
  }
  return null
}

function getAccessToken(key, mapStyle, opts) {
  const metadata = mapStyle.metadata || {}
  let accessToken = metadata['maputnik:'+key+'_access_token'];

  if(opts.allowFallback && !accessToken) {
    accessToken = tokens[key];
  }

  return accessToken;
}

function replaceSourceAccessToken(mapStyle, key, opts={}) {
  const source = mapStyle.sources[key]
  if(!source) return mapStyle
  if(!source.hasOwnProperty("url")) return mapStyle

  const accessToken = getAccessToken(key, mapStyle, opts)

  if(!accessToken) {
    // Early exit.
    return mapStyle;
  }

  const changedSources = {
    ...mapStyle.sources,
    [key]: {
      ...source,
      url: source.url.replace('{key}', accessToken)
    }
  }
  const changedStyle = {
    ...mapStyle,
    sources: changedSources
  }

  return changedStyle
}

function replaceAccessTokens(mapStyle, opts={}) {
  let changedStyle = mapStyle;

  Object.keys(tokens).forEach((tokenKey) => {
    changedStyle = replaceSourceAccessToken(changedStyle, tokenKey, opts);
  })

  if(mapStyle.glyphs && mapStyle.glyphs.match(/\.tileserver\.org/)) {
    changedStyle = {
      ...changedStyle,
      glyphs: mapStyle.glyphs ? mapStyle.glyphs.replace('{key}', getAccessToken("openmaptiles", mapStyle, opts)) : mapStyle.glyphs
    }
  }

  return changedStyle
}

export default {
  ensureStyleValidity,
  emptyStyle,
  indexOfLayer,
  generateId,
  replaceAccessTokens,
}
