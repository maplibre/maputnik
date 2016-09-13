import React from 'react'

export default class SymbolLayer extends React.Component {
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
				layerType="symbol"
				groupType="layout"
				properties={this.props.layer.get('layout', Immutable.Map())}
			/>
			<PropertyGroup
				onChange={this.props.onPaintChanged.bind(this)}
				layerType="symbol"
				groupType="paint"
				properties={this.props.layer.get('paint', Immutable.Map())}
			/>
		</div>
	}
}
