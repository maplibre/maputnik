import React from 'react'
import {saveAs} from 'file-saver'

import { Drawer, Container, Block, Fixed } from 'rebass'
import {Map} from './map.jsx'
import {Toolbar} from './toolbar.jsx'
import { StyleManager } from './style.js'
import { WorkspaceDrawer } from './workspace.jsx'

import theme from './theme.js'
import layout from './layout.scss'
import 'react-virtualized/styles.css'

export default class App extends React.Component {
  static childContextTypes = {
    rebass: React.PropTypes.object,
		reactIconBase: React.PropTypes.object
  }

	constructor(props) {
		super(props)
		this.state = {
			styleManager: new StyleManager(),
			workContext: "layers",
		}
	}

	onStyleDownload() {
		const mapStyle = this.state.styleManager.exportStyle()
		const blob = new Blob([mapStyle], {type: "application/json;charset=utf-8"});
		saveAs(blob, "glstyle.json");
	}

	onStyleUpload(newStyle) {
		this.setState({ styleManager: new StyleManager(newStyle) })
	}

	onOpenSettings() {
		this.setState({
			workContext: "settings",
		})
	}

	onOpenLayers() {
		this.setState({
			workContext: "layers",
		})
	}

  getChildContext() {
    return {
			rebass: theme,
			reactIconBase: {
        size: 20,
      }
		}
	}

  render() {
    return <div style={{ fontFamily: theme.fontFamily, color: theme.color }}>
			<Toolbar
					onStyleUpload={this.onStyleUpload.bind(this)}
					onStyleDownload={this.onStyleDownload.bind(this)}
					onOpenSettings={this.onOpenSettings.bind(this)}
					onOpenLayers={this.onOpenLayers.bind(this)}
			/>
			<WorkspaceDrawer workContext={this.state.workContext} styleManager={this.state.styleManager}/>
			<div className={layout.map}>
				<Map styleManager={this.state.styleManager} />
			</div>
		</div>
  }
}
