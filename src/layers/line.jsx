import React from 'react'
import Immutable from 'immutable'
import { PropertyGroup } from '../fields/spec'
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class LineLayer extends React.Component {
	static propTypes = {
		layer: React.PropTypes.instanceOf(Immutable.Map).isRequired,
		onPaintChanged: React.PropTypes.func.isRequired,
    onLayoutChanged: React.PropTypes.func.isRequired,
  }

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	render() {
		return <div>
			<PropertyGroup
				onChange={this.props.onLayoutChanged.bind(this)}
				layerType="line"
				groupType="layout"
				properties={this.props.layer.get('layout', Immutable.Map())}
			/>
			<PropertyGroup
				onChange={this.props.onPaintChanged.bind(this)}
				layerType="line"
				groupType="paint"
				properties={this.props.layer.get('paint', Immutable.Map())}
			/>
		</div>
	}
}
