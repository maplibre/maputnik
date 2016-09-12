import React from 'react'
import Immutable from 'immutable'
import { PropertyGroup } from '../fields/spec'

export default class LineLayer extends React.Component {
	static propTypes = {
		layer: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  }

	render() {
		return <div>
			<PropertyGroup layerType="line" groupType="layout" properties={this.props.layer.get('layout', Immutable.Map())}/>
			<PropertyGroup layerType="line" groupType="paint" properties={this.props.layer.get('paint', Immutable.Map())}/>
		</div>
	}
}
