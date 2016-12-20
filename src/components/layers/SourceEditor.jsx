import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable'

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
    sources: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  }

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

  render() {
		const options = this.props.sources.map((source, sourceId)=> {
			return <option key={sourceId} value={sourceId}>{sourceId}</option>
		}).toIndexedSeq()

    const layerOptions = this.props.sources.get(this.props.source, Immutable.Set()).map(vectorLayerId => {
      const id = vectorLayerId
			return <option key={id} value={id}>{id}</option>
		}).toIndexedSeq()

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
