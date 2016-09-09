import React from 'react'

import { Block, ButtonCircle, Heading, Checkbox, Slider, Switch, Input, Panel, PanelHeader, Toolbar, NavItem, Tooltip, Container, Space} from 'rebass'
import { Button, Text } from 'rebass'
import {MdArrowDropDown, MdArrowDropUp, MdAddToPhotos, MdDelete, MdVisibilityOff} from 'react-icons/lib/md';
import Collapse from 'react-collapse'
import theme from './theme.js'
import scrollbars from './scrollbars.scss'

export class FillLayer extends React.Component {
	render() {
		return <div>
			<Input name="fill-color" label="Fill color" onChange={this.props.changePaint} value={this.props.paint["fill-color"]} />
			<Input name="fill-outline-color" label="Fill outline color" onChange={this.props.changePaint} value={this.props.paint["fill-outline-color"]} />
			<Input name="fill-translate" label="Fill translate" onChange={this.props.changePaint} value={this.props.paint["fill-translate"]} />
			<Input name="fill-translate-anchor" label="Fill translate anchor" onChange={this.props.changePaint} value={this.props.paint["fill-translate-anchor"]} />
			<Checkbox name="fill-antialias" label="Antialias" onChange={this.props.changePaint} checked={this.props.paint["fill-antialias"]} />
			<Input name="fill-opacity" label="Opacity" onChange={this.props.changePaint} value={this.props.paint["fill-opacity"]} />
		</div>


	}
}

export class LineLayer extends React.Component {
	render() {
		return <div></div>
	}
}

export class SymbolLayer extends React.Component {
	render() {
		return <div></div>
	}
}

export class LayerPanel extends React.Component {
  static childContextTypes = {
		reactIconBase: React.PropTypes.object
  }

	constructor(props) {
		super(props);
		this.toggleLayer = this.toggleLayer.bind(this);
		this.state = {
			isOpened: false
		}
	}

  getChildContext () {
    return {
			reactIconBase: {
        size: theme.fontSizes[4],
				color: theme.colors.lowgray,
      }
		}
	}

	toggleLayer() {
		this.setState({isOpened: !this.state.isOpened})
	}

	render() {
		let layer = <FillLayer paint={this.props.layer.paint}/>
		if (this.props.layer.type === "line") {
			layer = <LineLayer />
		} else if (this.props.layer.type === "symbol") {
			layer = <SymbolLayer />
		}

		return <div style={{
				padding: theme.scale[0],
				borderBottom: 1,
				borderTop: 1,
				borderLeft: 0,
				borderRight: 0,
				borderStyle: "solid",
				borderColor: theme.borderColor,
			}}>
			<Toolbar onClick={this.toggleLayer}>
				<NavItem>
					#{this.props.layer.id}
				</NavItem>
				<Space auto x={1} />
				<NavItem>
					<MdVisibilityOff />
				</NavItem>
				<NavItem>
					<MdDelete />
				</NavItem>
			</Toolbar>
			<Collapse isOpened={this.state.isOpened}>
				<div style={{padding: theme.scale[2], paddingRight: 0}}>
				{layer}
				</div>
			</Collapse>
		</div>
	}
}

export class LayerEditor extends React.Component {
	render() {
		const layerPanels = this.props.layers.map(layer => {
			return <LayerPanel key={layer.id} layer={layer} />
		});
		return <div>
			<Toolbar style={{marginRight: 20}}>
				<NavItem>
					Layers
				</NavItem>
				<Space auto x={1} />
				<Button>
					<MdAddToPhotos />
					Add Layer
				</Button>
			</Toolbar>

			<div className={scrollbars.darkScrollbar} style={{
				overflowY: "scroll",
				bottom:0,
				left:0,
				right:0,
				top:40,
				position: "absolute",
			}}>
			{layerPanels}
			</div>
		</div>
	}
}
