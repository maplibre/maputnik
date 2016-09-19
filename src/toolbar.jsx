import React from 'react';
import FileReaderInput from 'react-file-reader-input';

import Button from 'rebass/dist/Button'
import Text from 'rebass/dist/Text'
import Menu from 'rebass/dist/Menu'
import NavItem from 'rebass/dist/NavItem'
import Tooltip from 'rebass/dist/Tooltip'
import Container from 'rebass/dist/Container'
import Block from 'rebass/dist/Block'
import Fixed from 'rebass/dist/Fixed'

import MdFileDownload from 'react-icons/lib/md/file-download'
import MdFileUpload from 'react-icons/lib/md/file-upload'
import MdSettings from 'react-icons/lib/md/settings'
import MdInfo from 'react-icons/lib/md/info'
import MdLayers from 'react-icons/lib/md/layers'
import MdSave from 'react-icons/lib/md/save'
import MdMap from 'react-icons/lib/md/map'

import style from './style.js'
import { fullHeight } from './theme.js'
import theme from './theme.js';

export class Toolbar extends React.Component {
	static propTypes = {
		// A new style has been uploaded
		onStyleUpload: React.PropTypes.func.isRequired,
		// Current style is requested for download
		onStyleDownload: React.PropTypes.func.isRequired,
		// Style is explicitely saved to local cache
		onStyleSave: React.PropTypes.func,
		// Open settings drawer
		onOpenSettings: React.PropTypes.func,
		// Open about page
		onOpenAbout: React.PropTypes.func,
		// Open sources drawer
		onOpenSources: React.PropTypes.func,
		// Open layers drawer
		onOpenLayers: React.PropTypes.func,
		// Whether a style is available for download or saving
		// A style with no layers should not be available
		styleAvailable: React.PropTypes.bool,
	}

	onUpload(_, files) {
		const [e, file] = files[0];
		const reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		reader.onload = e => {
			this.props.onStyleUpload(style.fromJSON(JSON.parse(e.target.result)));
		}
		reader.onerror = e => console.log(e.target);
	}

	saveButton() {
		if(this.props.styleAvailable) {
			return <Block>
				<Button onClick={this.props.onStyleSave} big={true}>
					<Tooltip inverted rounded title="Save style">
						<MdSave />
					</Tooltip>
				</Button>
			</Block>
		}
		return null
	}

	downloadButton() {
		if(this.props.styleAvailable) {
			return <Block>
				<Button onClick={this.props.onStyleDownload} big={true}>
					<Tooltip inverted rounded title="Download style">
						<MdFileDownload />
					</Tooltip>
				</Button>
			</Block>
		}
		return null
	}

	render() {
		return <Container style={{
			...fullHeight,
			zIndex: 100,
			left: 0,
			top: 0,
			backgroundColor: theme.colors.black }
		}>
			<Block>
				<FileReaderInput onChange={this.onUpload.bind(this)}>
					<Button big={true} theme={this.props.styleAvailable ? "default" : "success"}>
						<Tooltip inverted rounded title="Upload style">
							<MdFileUpload />
						</Tooltip>
					</Button>
				</FileReaderInput>
			</Block>
			{this.downloadButton()}
			{this.saveButton()}
			<Block>
				<Button big={true} onClick={this.props.onOpenLayers}>
					<Tooltip inverted rounded title="Layers">
						<MdLayers />
					</Tooltip>
				</Button>
			</Block>
			<Block>
				<Button big={true} onClick={this.props.onOpenSources}>
					<Tooltip inverted rounded title="Sources">
						<MdMap />
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
			<Block>
				<Button big={true} onClick={this.props.onOpenAbout}>
					<Tooltip inverted rounded title="About">
						<MdInfo />
					</Tooltip>
				</Button>
			</Block>
		</Container>
	}
}
