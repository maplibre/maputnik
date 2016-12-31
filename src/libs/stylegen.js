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
  const layer = {
    id: `${source}_${vectorLayer}_circle`,
    source: source,
    type: 'circle',
    paint: {
      'circle-color': color,
      'circle-radius': 2,
    },
    filter: ["==", "$type", "Point"]
  }
  if(vectorLayer) {
    layer['source-layer'] = vectorLayer
  }
  return layer
}

function polygonLayer(source, vectorLayer, color, fillColor) {
  const layer = {
    id: `${source}_${vectorLayer}_polygon`,
    source: source,
    type: 'fill',
    paint: {
      'fill-color': fillColor,
      'fill-antialias': true,
      'fill-outline-color': color,
    },
    filter: ["==", "$type", "Polygon"]
  }
  if(vectorLayer) {
    layer['source-layer'] = vectorLayer
  }
  return layer
}

function lineLayer(source, vectorLayer, color) {
  const layer = {
    id: `${source}_${vectorLayer}_line`,
    source: source,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    type: 'line',
    paint: {
      'line-color': color,
    },
    filter: ["==", "$type", "LineString"]
  }
  if(vectorLayer) {
    layer['source-layer'] = vectorLayer
  }
  return layer
}

export function colorHighlightedLayer(layer) {
  if(!layer || layer.type === 'background' || layer.type === 'raster') return null

  function changeLayer(l) {
    if(layer.filter) {
      l.filter = layer.filter
    } else {
      delete l['filter']
    }
    l.id = l.id + '_highlight'
    return l
  }

  const color = assignVectorLayerColor(layer.id)
  const layers = []

  if(layer.type === "fill" || layer.type === 'fill-extrusion') {
    return changeLayer(polygonLayer(layer.source, layer['source-layer'], color, Color(color).alpha(0.2).string()))
  }

  if(layer.type === "symbol" || layer.type === 'circle') {
    return changeLayer(circleLayer(layer.source, layer['source-layer'], color))
  }

  if(layer.type === 'line') {
    return changeLayer(lineLayer(layer.source, layer['source-layer'], color))
  }

  return null
}

export function generateColoredLayers(sources) {
  const polyLayers = []
  const circleLayers = []
  const lineLayers = []

  Object.keys(sources).forEach(sourceId => {
    const layers = sources[sourceId]

    // Deal with GeoJSON sources that do not have any source layers
    if(!layers) {
      const color = Color(assignVectorLayerColor(sourceId))
      circleLayers.push(circleLayer(sourceId, null, color.alpha(0.3).string()))
      lineLayers.push(lineLayer(sourceId, null, color.alpha(0.3).string()))
      polyLayers.push(polygonLayer(sourceId, null, color.alpha(0.2).string(), color.alpha(0.05).string()))
      return
    }

    layers.forEach(layerId => {
      const color = Color(assignVectorLayerColor(layerId))
      circleLayers.push(circleLayer(sourceId, layerId, color.alpha(0.3).string()))
      lineLayers.push(lineLayer(sourceId, layerId, color.alpha(0.3).string()))
      polyLayers.push(polygonLayer(sourceId, layerId, color.alpha(0.2).string(), color.alpha(0.05).string()))
    })
  })

  return polyLayers.concat(lineLayers).concat(circleLayers)
}
