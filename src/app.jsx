import React from 'react'

import { Drawer, Container, Block, Fixed } from 'rebass'
import {Map} from './map.jsx'
import {Toolbar} from './toolbar.jsx'
import { LayerEditor } from './layers.jsx'
import { StyleManager } from './style.js'

import theme from './theme.js'
import layout from './layout.scss'
import 'react-virtualized/styles.css'

export class WorkspaceDrawer extends React.Component {
	static propTypes = {
    styleManager: React.PropTypes.object.isRequired
  }

	render() {
		let editor = null
		if(this.props.styleManager.mapStyle) {
			editor = <LayerEditor styleManager={this.props.styleManager}/>
		}

		return <div style={{
			zIndex: 100,
			position: "fixed",
			left: 60,
			width: 300,
			top: 0,
			bottom: 0,
			overflow: "hidden",
			backgroundColor: theme.colors.gray}
		}>
			{editor}
		</div>
	}
}

export default class App extends React.Component {
  static childContextTypes = {
    rebass: React.PropTypes.object,
		reactIconBase: React.PropTypes.object
  }

	constructor(props) {
		super(props)
		this.state = {
			styleManager: new StyleManager(),
		}
	}

	onStyleUpload(newStyle) {
		this.setState({ styleManager: new StyleManager(newStyle) })
	}

  getChildContext () {
    return {
			rebass: theme,
			reactIconBase: {
        size: 20,
      }
		}
	}

  render() {
    return <div style={{ fontFamily: theme.fontFamily, color: theme.color }}>
			<Toolbar onStyleUpload={this.onStyleUpload.bind(this)} />
			<WorkspaceDrawer styleManager={this.state.styleManager}/>
			<div className={layout.map}>
				<Map styleManager={this.state.styleManager} />
			</div>
		</div>
  }
}
