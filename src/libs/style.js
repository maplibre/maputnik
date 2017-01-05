import React from 'react';
import spec from 'mapbox-gl-style-spec/reference/latest.min.js'
import derefLayers from 'mapbox-gl-style-spec/lib/deref'

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

function ensureHasNoRefs(style) {
  const derefedStyle = {
    ...style,
    layers: derefLayers(style.layers)
  }
  return derefedStyle
}

function ensureStyleValidity(style) {
  return ensureHasNoRefs(ensureHasId(style))
}

function indexOfLayer(layers, layerId) {
  for (let i = 0; i < layers.length; i++) {
    if(layers[i].id === layerId) {
      return i
    }
  }
  return null
}

export default {
  ensureStyleValidity,
  emptyStyle,
  indexOfLayer,
  generateId,
}
