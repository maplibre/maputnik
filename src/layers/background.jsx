import React from 'react'
import Immutable from 'immutable'
import { Input } from 'rebass'
import { PropertyGroup } from '../fields/spec'
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class BackgroundLayer extends React.Component {
	static propTypes = {
		layer: React.PropTypes.instanceOf(Immutable.Map).isRequired,
		onPaintChanged: React.PropTypes.func.isRequired
	}

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	onPaintChanged(property, value) {
		if (property == "background-opacity" && !isNaN(parseFloat(value))) {
			value = parseFloat(value)
		}
		this.props.onPaintChanged(property, value)
	}

	render() {
		return <div>
			<PropertyGroup
				layerType="background"
				groupType="layout"
				properties={this.props.layer.get('layout', Immutable.Map())}
			/>
			<PropertyGroup
				onChange={this.props.onPaintChanged.bind(this)}
				layerType="background"
				groupType="paint"
				properties={this.props.layer.get('paint', Immutable.Map())}
			/>
		</div>
	}
}

