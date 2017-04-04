import React from 'react';
import spec from 'mapbox-gl/src/style-spec/reference/latest'
import derefLayers from 'mapbox-gl/src/style-spec/deref'
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
    layers: derefLayers(style.layers)
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

function replaceAccessToken(mapStyle) {
  const omtSource = mapStyle.sources.openmaptiles
  if(!omtSource) return mapStyle

  const metadata = mapStyle.metadata || {}
  const accessToken = metadata['maputnik:openmaptiles_access_token'] || tokens.openmaptiles
  const changedSources = {
    ...mapStyle.sources,
    openmaptiles: {
      ...omtSource,
      url: omtSource.url.replace('{key}', accessToken)
    }
  }
  const changedStyle = {
    ...mapStyle,
    glyphs: mapStyle.glyphs ? mapStyle.glyphs.replace('{key}', accessToken) : mapStyle.glyphs,
    sources: changedSources
  }

  return changedStyle
}

export default {
  ensureStyleValidity,
  emptyStyle,
  indexOfLayer,
  generateId,
  replaceAccessToken,
}
