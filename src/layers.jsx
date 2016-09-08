import React from 'react'

import { Toolbar, NavItem, Tooltip, Container, Space} from 'rebass'
import { Button, Text } from 'rebass'

import theme from './theme.js'

export class LayerEditor extends React.Component {
	render() {
		const layerBlocks = this.props.layers.map(layer => {
			console.log(layer)
			return <Text>{layer.id}</Text>
		});
		return <Container>
			<Toolbar>
				<NavItem is="a">
					Toolbar
				</NavItem>
			</Toolbar>
			{layerBlocks}
		</Container>
	}
}
