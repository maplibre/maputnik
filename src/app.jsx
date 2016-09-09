import React from 'react'

import { Drawer, Container, Block, Fixed } from 'rebass'
import {Map} from './map.jsx'
import {Toolbar} from './toolbar.jsx'
import { LayerEditor } from './layers.jsx'

import theme from './theme.js'
import layout from './layout.scss'
import 'react-virtualized/styles.css';

export class WorkspaceDrawer extends React.Component {
	render() {
		let editor = null

		if(this.props.mapStyle) {
			editor = <LayerEditor layers={this.props.mapStyle.layers}/>
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
		this.updateStyle = this.updateStyle.bind(this);
		this.state = {
			mapStyle: null
		}
	}

	updateStyle(newStyle) {
		this.setState({ mapStyle: newStyle })
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
		console.log(this.state.mapStyle)
    return <div style={{ fontFamily: theme.fontFamily, color: theme.color }}>
			<Toolbar onStyleUpload={this.updateStyle} />
			<WorkspaceDrawer mapStyle={this.state.mapStyle} />
			<div className={layout.map}>
				<Map mapStyle={this.state.mapStyle} />
			</div>
		</div>
  }
}
