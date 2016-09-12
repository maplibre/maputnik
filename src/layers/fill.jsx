import React from 'react'
import Immutable from 'immutable'
import { Checkbox, Input } from 'rebass'
import { PropertyGroup } from '../fields/spec'
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class FillLayer extends React.Component {
	static propTypes = {
		layer: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    onPaintChanged: React.PropTypes.func.isRequired
  }

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	onPaintChanged(property, e) {
		let value = e.target.value
		if (property == "fill-opacity") {
			value = parseFloat(value)
		}

		this.props.onPaintChanged(property, value)
	}

	render() {
		return <div>
			<PropertyGroup
				layerType="fill"
				groupType="layout"
				properties={this.props.layer.get('layout', Immutable.Map())}
			/>
			<PropertyGroup
				onChange={this.props.onPaintChanged.bind(this)}
				layerType="fill"
				groupType="paint"
				properties={this.props.layer.get('paint', Immutable.Map())}
			/>
		</div>
	}
}
