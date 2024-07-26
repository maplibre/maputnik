import {derefLayers} from '@maplibre/maplibre-gl-style-spec'
import type {StyleSpecification, LayerSpecification} from 'maplibre-gl'
import tokens from '../config/tokens.json'

// Empty style is always used if no style could be restored or fetched
const emptyStyle = ensureStyleValidity({
  version: 8,
  sources: {},
  layers: [],
})

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function ensureHasId(style: StyleSpecification & { id?: string }): StyleSpecification & { id: string } {
  if(!('id' in style) || !style.id) {
    style.id = generateId();
    return style as StyleSpecification & { id: string };
  }
  return style as StyleSpecification & { id: string };
}

function ensureHasNoInteractive(style: StyleSpecification & {id: string}) {
  const changedLayers = style.layers.map(layer => {
    const changedLayer: LayerSpecification & { interactive?: any } = { ...layer }
    delete changedLayer.interactive
    return changedLayer
  })

  return {
    ...style,
    layers: changedLayers
  }
}

function ensureHasNoRefs(style: StyleSpecification & {id: string}) {
  return {
    ...style,
    layers: derefLayers(style.layers)
  }
}

function ensureStyleValidity(style: StyleSpecification): StyleSpecification & { id: string } {
  return ensureHasNoInteractive(ensureHasNoRefs(ensureHasId(style)))
}

function indexOfLayer(layers: LayerSpecification[], layerId: string) {
  for (let i = 0; i < layers.length; i++) {
    if(layers[i].id === layerId) {
      return i
    }
  }
  return null
}

function getAccessToken(sourceName: string, sourceUrl: string, mapStyle: StyleSpecification, opts: {allowFallback?: boolean}) {
  if(sourceName === "thunderforest_transport" || sourceName === "thunderforest_outdoors") {
    sourceName = "thunderforest";
  }

  if (sourceUrl.includes("api.syte.ms")) {
    sourceName = "auth";
  }

  const metadata = mapStyle.metadata || {} as any;
  let accessToken = metadata[`maputnik:${sourceName}_access_token`]

  if(opts.allowFallback && !accessToken) {
    accessToken = tokens[sourceName as keyof typeof tokens]
  }

  return accessToken;
}

function replaceSourceAccessToken(mapStyle: StyleSpecification, sourceName: string, opts={}) {
  const source = mapStyle.sources[sourceName]
  if(!source) return mapStyle
  if(!("url" in source) || !source.url) return mapStyle

  const accessToken = getAccessToken(sourceName, source.url, mapStyle, opts)

  if(!accessToken) {
    // Early exit.
    return mapStyle;
  }

  const changedSources = {
    ...mapStyle.sources,
    [sourceName]: {
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

function replaceAccessTokens(mapStyle: StyleSpecification, opts={}) {
  let changedStyle = mapStyle

  Object.keys(mapStyle.sources).forEach((sourceName) => {
    changedStyle = replaceSourceAccessToken(changedStyle, sourceName, opts);
  })

  if (mapStyle.glyphs && (mapStyle.glyphs.match(/\.tilehosting\.com/) || mapStyle.glyphs.match(/\.maptiler\.com/))) {
    const newAccessToken = getAccessToken("openmaptiles", mapStyle, opts);
    if (newAccessToken) {
      changedStyle = {
        ...changedStyle,
        glyphs: mapStyle.glyphs.replace('{key}', newAccessToken)
      }
    }
  }

  return changedStyle
}

function stripAccessTokens(mapStyle: StyleSpecification) {
  const changedMetadata = {
    ...mapStyle.metadata as any
  };
  delete changedMetadata['maputnik:openmaptiles_access_token'];
  return {
    ...mapStyle,
    metadata: changedMetadata
  };
}

export default {
  ensureStyleValidity,
  emptyStyle,
  indexOfLayer,
  generateId,
  getAccessToken,
  replaceAccessTokens,
  stripAccessTokens,
}
