import React from 'react'

export default class SymbolLayer extends React.Component {
	render() {
		return <div>
			<PropertyGroup layerType="symbol" groupType="layout" properties={this.props.layer.get('layout', Immutable.Map())}/>
			<PropertyGroup layerType="symbol" groupType="paint" properties={this.props.layer.get('paint', Immutable.Map())}/>
		</div>
	}
}
