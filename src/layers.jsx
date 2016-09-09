import React from 'react'

import { Block, ButtonCircle, Heading, Checkbox, Slider, Switch, Input, Panel, PanelHeader, Toolbar, NavItem, Tooltip, Container, Space} from 'rebass'
import { Button, Text } from 'rebass'
import {MdArrowDropDown, MdArrowDropUp, MdAddToPhotos, MdDelete, MdVisibilityOff} from 'react-icons/lib/md';
import Collapse from 'react-collapse'
import theme from './theme.js'
import scrollbars from './scrollbars.scss'

export class FillLayer extends React.Component {
	static propTypes = {
    layer: React.PropTypes.object.isRequired,
    onPaintChanged: React.PropTypes.func.isRequired
  }

	onPaintChanged(property, e) {
		let value = e.target.value
		if (property == "fill-opacity") {
			value = parseFloat(value)
		}

		this.props.onPaintChanged(property, value)
	}

	render() {
		const paint = this.props.layer.paint
		return <div>
			<Input name="fill-color" label="Fill color" onChange={this.onPaintChanged.bind(this, "fill-color")} value={paint["fill-color"]} />
			<Input name="fill-outline-color" label="Fill outline color" onChange={this.onPaintChanged.bind(this, "fill-outline-color")} value={paint["fill-outline-color"]} />
			<Input name="fill-translate" label="Fill translate" onChange={this.onPaintChanged.bind(this, "fill-translate")} value={paint["fill-translate"]} />
			<Input name="fill-translate-anchor" label="Fill translate anchor" onChange={this.onPaintChanged.bind(this, "fill-translate-anchor")} value={paint["fill-translate-anchor"]} />
			<Checkbox name="fill-antialias" label="Antialias" onChange={this.onPaintChanged.bind(this, "fill-antialias")} checked={paint["fill-antialias"]} />
			<Input name="fill-opacity" label="Opacity" onChange={this.onPaintChanged.bind(this, "fill-opacity")} value={paint["fill-opacity"]} />
		</div>
	}
}

export class BackgroundLayer extends React.Component {
	static propTypes = {
    layer: React.PropTypes.object.isRequired,
    onPaintChanged: React.PropTypes.func.isRequired
  }

	onPaintChanged(property, e) {
		let value = e.target.value
		if (property == "background-opacity" && !isNaN(parseFloat(value))) {
			value = parseFloat(value)
		}
		this.props.onPaintChanged(property, value)
	}

	render() {
		const paint = this.props.layer.paint
		return <div>
			<Input name="background-color" label="Background color" onChange={this.onPaintChanged.bind(this, "background-color")} value={paint["background-color"]} />
			<Input name="background-opacity" label="Background opacity" onChange={this.onPaintChanged.bind(this, "background-opacity")} value={paint["background-opacity"]} />
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

export class NoLayer extends React.Component {
	render() {
		return <div></div>
	}
}

export class LayerPanel extends React.Component {
	static propTypes = {
    layer: React.PropTypes.object.isRequired,
    styleManager: React.PropTypes.object.isRequired
  }

  static childContextTypes = {
		reactIconBase: React.PropTypes.object
  }

	constructor(props) {
		super(props);
		this.state = {
			isOpened: false,
			//TODO: Is that bad practice?
			//however I want to keep the layer state local herere
			//otherwise the style always would, propagate around?
			layer: this.props.layer
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

	onPaintChanged(property, newValue) {
		let layer = this.state.layer
		layer.paint[property] = newValue;

		this.props.styleManager.changeStyle({
			command: 'setPaintProperty',
			args: [layer.id, property, newValue]
		})

		this.setState({ layer });
	}

	toggleLayer() {
		this.setState({isOpened: !this.state.isOpened})
	}

	layerFromType(type) {
		if (type === "fill") {
			return <FillLayer layer={this.state.layer} onPaintChanged={this.onPaintChanged.bind(this)} />
		}

		if (type === "background") {
			return <BackgroundLayer layer={this.state.layer} onPaintChanged={this.onPaintChanged.bind(this)} />
		}

		if (type === "line") {
			return <LineLayer />
		}

		if (type === "symbol") {
			return <SymbolLayer />
		}
		return <NoLayer />
	}

	render() {
		return <div style={{
				padding: theme.scale[0],
				borderBottom: 1,
				borderTop: 1,
				borderLeft: 0,
				borderRight: 0,
				borderStyle: "solid",
				borderColor: theme.borderColor,
			}}>
			<Toolbar onClick={this.toggleLayer.bind(this)}>
				<NavItem>
					#{this.state.layer.id}
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
				{this.layerFromType(this.state.layer.type)}
				</div>
			</Collapse>
		</div>
	}
}

export class LayerEditor extends React.Component {
	static propTypes = {
    styleManager: React.PropTypes.object.isRequired
  }

	render() {
		const layers = this.props.styleManager.layers()
		const layerPanels = layers.map(layer => {
			return <LayerPanel key={layer.id} layer={layer} styleManager={this.props.styleManager} />
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
