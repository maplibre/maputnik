import Immutable from 'immutable'

/** Listens to map events to build up a store of available vector
 * layers contained in the tiles */
export default class LayerWatcher {
  constructor() {
    this._sources = {}
  }

  /** Set the map as soon as the map is initialized */
  set map(m) {
    //TODO: At some point we need to unsubscribe when new map is set
    m.on('data', (e) => {
      if(e.dataType !== 'tile') return
      this._sources[e.source.id] = e.source.vectorLayerIds
    })
  }

  /** Access all known sources and their vector tile ids */
  get sources() {
    console.log(this._sources)
    return Immutable.Map(Object.keys(this._sources).map(key => {
      return [key, Immutable.Set(this._sources[key])]
    }))
  }
}
