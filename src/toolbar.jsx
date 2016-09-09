import React from 'react';
import FileReaderInput from 'react-file-reader-input';

import { Button, Text } from 'rebass';
import { Menu, NavItem, Tooltip, Container, Block, Fixed } from 'rebass'
import { MdFileDownload, MdFileUpload, MdSettings, MdPalette, MdLayers, MdSave, MdFolderOpen} from 'react-icons/lib/md';

import theme from './theme.js';

export class Toolbar extends React.Component {
	static propTypes = {
    onStyleUpload: React.PropTypes.func.isRequired,
    onStyleDownload: React.PropTypes.func.isRequired,
    onOpenSettings: React.PropTypes.func,
    onOpenLayers: React.PropTypes.func,
  }

	constructor(props) {
		super(props);
		this.onUpload = this.onUpload.bind(this);
		this.state = {
			styleUploaded: false
		}
	}

	onUpload(_, files) {
		const [e, file] = files[0];
		const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = e => {
			const style = JSON.parse(e.target.result);
			this.props.onStyleUpload(style);
			this.setState({
				styleUploaded: true
			})
		}
    reader.onerror = e => console.log(e.target);
	}

	render() {
		let downloadButton = null
		if(this.state.styleUploaded) {
			downloadButton = <Block>
				<Button onClick={this.props.onStyleDownload} big={true}>
					<Tooltip inverted rounded title="Download style">
						<MdFileDownload />
					</Tooltip>
				</Button>
			</Block>
		}

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
					<Button big={true} theme={this.state.styleUploaded ? "default" : "success"}>
						<Tooltip inverted rounded title="Upload style">
						  <MdFileUpload />
						</Tooltip>
					</Button>
					</FileReaderInput>
			</Block>
			{downloadButton}
			<Block>
				<Button big={true} onClick={this.props.onOpenLayers}>
					<Tooltip inverted rounded title="Layers">
						<MdLayers />
          </Tooltip>
				</Button>
			</Block>
			<Block>
				<Button big={true} onClick={this.props.onOpenSettings}>
					<Tooltip inverted rounded title="Settings">
						<MdSettings />
          </Tooltip>
				</Button>
			</Block>
		</Container>
	}
}
