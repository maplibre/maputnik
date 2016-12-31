import throttle from 'lodash.throttle'
import isEqual from 'lodash.isequal'

/** Listens to map events to build up a store of available vector
 * layers contained in the tiles */
export default class LayerWatcher {
  constructor(opts = {}) {
    this.onSourcesChange = opts.onSourcesChange || (() => {})
    this.onVectorLayersChange = opts.onVectorLayersChange || (() => {})

    this._sources = {}
    this._vectorLayers = {}

    // Since we scan over all features we want to avoid this as much as
    // possible and only do it after a batch of data has loaded because
    // we only care eventuall about knowing the fields in the vector layers
    this.throttledAnalyzeVectorLayerFields = throttle(this.analyzeVectorLayerFields, 5000)
  }

  analyzeMap(map) {
    const previousSources = { ...this._sources }

    Object.keys(map.style.sourceCaches).forEach(sourceId => {
      //NOTE: This heavily depends on the internal API of Mapbox GL
      //so this breaks between Mapbox GL JS releases
      this._sources[sourceId] = map.style.sourceCaches[sourceId]._source.vectorLayerIds
    })

    if(!isEqual(previousSources, this._sources)) {
      this.onSourcesChange(this._sources)
    }

    this.throttledAnalyzeVectorLayerFields(map)
  }

  analyzeVectorLayerFields(map) {
    const previousVectorLayers = { ...this._vectorLayers }

    Object.keys(this._sources).forEach(sourceId => {
      (this._sources[sourceId] || []).forEach(vectorLayerId => {
        const knownProperties = this._vectorLayers[vectorLayerId] || {}
        const params = { sourceLayer: vectorLayerId }
        map.querySourceFeatures(sourceId, params).forEach(feature => {
          Object.keys(feature.properties).forEach(propertyName => {
            const knownPropertyValues = knownProperties[propertyName] || {}
            knownPropertyValues[feature.properties[propertyName]] = {}
            knownProperties[propertyName] = knownPropertyValues
          })
        })

        this._vectorLayers[vectorLayerId] = knownProperties
      })
    })

    if(!isEqual(previousVectorLayers, this._vectorLayers)) {
      this.onVectorLayersChange(this._vectorLayers)
    }

  }

  /** Access all known sources and their vector tile ids */
  get sources() {
    return this._sources
  }

  get vectorLayers() {
    return this._vectorLayers
  }
}
