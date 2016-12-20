import React from 'react'

import PropertyGroup from '../fields/PropertyGroup'
import input from '../../config/input.js'

/** Choose tileset (source) and the source layer */
export default class SourceEditor extends React.Component {
	static propTypes = {
		source: React.PropTypes.string.isRequired,
		sourceLayer: React.PropTypes.string.isRequired,

    onSourceChange: React.PropTypes.func.isRequired,
    onSourceLayerChange: React.PropTypes.func.isRequired,

    /** List of available sources in the style
     * https://www.mapbox.com/mapbox-gl-style-spec/#root-sources */
    sources: React.PropTypes.object.isRequired,
  }

  render() {
		const options = Object.keys(this.props.sources).map(sourceId => {
			return <option key={sourceId} value={sourceId}>{sourceId}</option>
		})

    const layerOptions = this.props.sources[this.props.source].map(vectorLayerId => {
      const id = vectorLayerId
			return <option key={id} value={id}>{id}</option>
		})

	  return <div>
      <div style={input.property}>
        <label style={input.label}>Source</label>
        <select
          style={input.select}
          value={this.props.source}
          onChange={(e) => this.onSourceChange(e.target.value)}
        >
          {options}
        </select>
      </div>
	    <div style={input.property}>
        <label style={input.label}>Source Layer</label>
        <select
          style={input.select}
          value={this.props.sourceLayer}
          onChange={(e) => this.onSourceLayerChange(e.target.value)}
        >
          {layerOptions}
        </select>
		  </div>
		</div>

	}
}
