import randomColor from 'randomcolor'
import Color from 'color'

function assignVectorLayerColor(layerId) {
  let hue = null
  if(/water|ocean|lake|sea|river/.test(layerId)) {
    hue = 'blue'
  }

  if(/road|highway|transport/.test(layerId)) {
    hue = 'orange'
  }

  if(/building/.test(layerId)) {
    hue = 'yellow'
  }

  if(/wood|forest|park|landcover|landuse/.test(layerId)) {
    hue = 'green'
  }

  return randomColor({
    luminosity: 'bright',
    hue: hue,
    seed: layerId,
  })
}

function circleLayer(source, vectorLayer, color) {
  return {
    id: vectorLayer + Math.random(),
    source: source,
    'source-layer': vectorLayer,
    interactive: true,
    type: 'circle',
    paint: {
      'circle-color': color,
      'circle-radius': 2,
    },
    filter: ["==", "$type", "Point"]
  }
}

function polygonLayer(source, vectorLayer, color) {
  return {
    id: vectorLayer + Math.random(),
    source: source,
    'source-layer': vectorLayer,
    interactive: true,
    type: 'fill',
    paint: {
      'fill-color': Color(color).alpha(0.15).string(),
      'fill-antialias': true,
      'fill-outline-color': color,
    },
    filter: ["==", "$type", "Polygon"]
  }
}

function lineLayer(source, vectorLayer, color) {
  return {
    id: vectorLayer + Math.random(),
    source: source,
    'source-layer': vectorLayer,
    interactive: true,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    type: 'line',
    paint: {'line-color': color},
    filter: ["==", "$type", "LineString"]
  }
}

export function generateColoredLayers(sources) {
  const styleLayers = []
  Object.keys(sources).forEach(sourceId => {
    const layers = sources[sourceId]
    layers.forEach(layerId => {
      const color = assignVectorLayerColor(layerId)
      styleLayers.push(circleLayer(sourceId, layerId, color))
      styleLayers.push(lineLayer(sourceId, layerId, color))
      styleLayers.push(polygonLayer(sourceId, layerId, color))
    })
  })
  return styleLayers
}
