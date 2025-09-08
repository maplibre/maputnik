import {derefLayers} from '@maplibre/maplibre-gl-style-spec'
import type {StyleSpecification, LayerSpecification} from 'maplibre-gl'
import tokens from '../config/tokens.json'
import type {StyleSpecificationWithId} from './definitions'

// Empty style is always used if no style could be restored or fetched
const emptyStyle = ensureStyleValidity({
  version: 8,
  sources: {},
  layers: [],
})

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function ensureHasId(style: StyleSpecification & { id?: string }): StyleSpecificationWithId {
  if(!('id' in style) || !style.id) {
    style.id = generateId();
  }
  return style as StyleSpecificationWithId;
}

function ensureHasNoInteractive(style: StyleSpecificationWithId) {
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

function ensureStyleValidity(style: StyleSpecification): StyleSpecificationWithId {
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

function getAccessToken(sourceName: string, mapStyle: StyleSpecification, opts: {allowFallback?: boolean}) {
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

  let authSourceName = sourceName
  if(sourceName === "thunderforest_transport" || sourceName === "thunderforest_outdoors") {
    authSourceName = "thunderforest"
  }
  else if (("url" in source) && source.url?.match(/\.stadiamaps\.com/)) {
    // The code currently usually assumes openmaptiles == MapTiler,
    // so we need to check the source URL.
    authSourceName = "stadia"
  }
  else if (("url" in source) && source.url?.match(/\.locationiq\.com/)) {
    authSourceName = "locationiq"
  }

  const accessToken = getAccessToken(authSourceName, mapStyle, opts)

  if(!accessToken) {
    // Early exit.
    return mapStyle;
  }

  let sourceUrl: string
  if (authSourceName == "stadia") {
    // Stadia Maps does not always require an API key,
    // so there is no placeholder in our styles.
    // We append it at the end of the URL when exporting if necessary.
    sourceUrl = `${source.url}?api_key=${accessToken}`
  } else {
    sourceUrl = source.url.replace('{key}', accessToken)
  }

  const changedSources = {
    ...mapStyle.sources,
    [sourceName]: {
      ...source,
      url: sourceUrl
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
  delete changedMetadata['maputnik:thunderforest_access_token'];
  delete changedMetadata['maputnik:stadia_access_token'];
  delete changedMetadata['maputnik:locationiq_access_token'];
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
