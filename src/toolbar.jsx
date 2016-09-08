import React from 'react';

import { Menu, NavItem, Tooltip, Container, Block, Fixed } from 'rebass'
import theme from './theme.jsx';
import {MdSettings, MdPalette, MdLayers, MdSave, MdFolderOpen} from 'react-icons/lib/md';
import { Button, Text } from 'rebass';

export class Toolbar extends React.Component {
	render() {
		return <Container style={{
			zIndex: 100,
			position: "fixed",
			height: "100%",
			left: "0",
			top: "0",
			bottom: "0",
			backgroundColor: theme.colors.black }
		}>
			<Block>
				<Button big={true}>
					<Tooltip inverted rounded title="Save">
						<MdSave />
          </Tooltip>
				</Button>
			</Block>
			<Block>
				<Button big={true}><MdFolderOpen /></Button>
			</Block>
			<Block>
				<Button big={true}>
					<Tooltip inverted rounded title="Layers">
						<MdLayers />
          </Tooltip>
				</Button>
			</Block>
			<Block>
				<Button big={true}><MdPalette /></Button>
			</Block>
			<Block>
				<Button big={true}><MdSettings /></Button>
			</Block>
		</Container>
	}
}
