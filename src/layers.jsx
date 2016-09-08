import React from 'react';

import { Toolbar, NavItem, Tooltip, Container, Space} from 'rebass'
import theme from './theme.jsx';
import { Button, Text } from 'rebass';

export class LayerEditor extends React.Component {
	render() {
		return <Container>
			<Toolbar>
				<NavItem is="a">
					Toolbar
				</NavItem>
			</Toolbar>
		</Container>;
	}
}
