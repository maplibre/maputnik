import React from 'react';
import FileReaderInput from 'react-file-reader-input';

import { Button, Text } from 'rebass';
import { Menu, NavItem, Tooltip, Container, Block, Fixed } from 'rebass'
import {MdSettings, MdPalette, MdLayers, MdSave, MdFolderOpen} from 'react-icons/lib/md';

import theme from './theme.js';

export class Toolbar extends React.Component {
	constructor(props) {
		super(props);
		this.onUpload = this.onUpload.bind(this);
	}

	onUpload(_, files) {
		const [e, file] = files[0];
		const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = e => {
			const style = JSON.parse(e.target.result);
			this.props.onStyleUpload(style);
		}
    reader.onerror = e => console.log(e.target);
	}

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
				  <FileReaderInput onChange={this.onUpload}>
					<Button big={true}>
						<Tooltip inverted rounded title="Save">
							<MdSave />
						</Tooltip>
					</Button>
					</FileReaderInput>
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
