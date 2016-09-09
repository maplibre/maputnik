import React from 'react'
import randomColor from 'randomcolor'
import { Block, ButtonCircle, Heading, Checkbox, Slider, Switch, Input, Panel, PanelHeader, Toolbar, NavItem, Tooltip, Container, Space} from 'rebass'
import { Button, Text } from 'rebass'
import {MdVisibility, MdArrowDropDown, MdArrowDropUp, MdAddToPhotos, MdDelete, MdVisibilityOff} from 'react-icons/lib/md';
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
    onLayerChanged: React.PropTypes.func.isRequired,
    onLayerDestroyed: React.PropTypes.func.isRequired,
  }

  static childContextTypes = {
		reactIconBase: React.PropTypes.object
  }

	constructor(props) {
		super(props);
		this.state = {
			isOpened: false,
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
		const layer = this.props.layer
		layer.paint[property] = newValue;
		this.props.onLayerChanged(layer)
	}

	onLayoutChanged(property, newValue) {
		const layer = this.props.layer
		layer.layout[property] = newValue;
		this.props.onLayerChanged(layer)
	}

	toggleLayer() {
		this.setState({isOpened: !this.state.isOpened})
	}

	layerFromType(type) {
		if (type === "fill") {
			return <FillLayer
				layer={this.props.layer}
				onPaintChanged={this.onPaintChanged.bind(this)}
			/>
		}

		if (type === "background") {
			return <BackgroundLayer
				layer={this.props.layer}
				onPaintChanged={this.onPaintChanged.bind(this)}
			/>
		}

		if (type === "line") {
			return <LineLayer />
		}

		if (type === "symbol") {
			return <SymbolLayer />
		}

		return <NoLayer />
	}

	toggleVisibility() {
		if(this.props.layer.layout.visibility === 'none') {
			this.onLayoutChanged('visibility', 'visible')
		} else {
			this.onLayoutChanged('visibility', 'none')
		}
	}

	render() {
		let visibleIcon = <MdVisibilityOff />
		if(this.props.layer.layout && this.props.layer.layout.visibility === 'none') {
			visibleIcon = <MdVisibility />
		}

		return <div style={{
				padding: theme.scale[0],
				borderBottom: 1,
				borderTop: 1,
				borderLeft: 2,
				borderRight: 0,
				borderStyle: "solid",
				borderColor: theme.borderColor,
				borderLeftColor: this.props.layer.metadata["mapolo:color"],
			}}>
			<Toolbar onClick={this.toggleLayer.bind(this)}>
				<NavItem style={{fontWeight: 400}}>
					#{this.props.layer.id}
				</NavItem>
				<Space auto x={1} />
				<NavItem onClick={this.toggleVisibility.bind(this)}>
				  {visibleIcon}
				</NavItem>
				<NavItem onClick={(e) => this.props.onLayerDestroyed(this.props.layer)}>
					<MdDelete />
				</NavItem>
			</Toolbar>
			<Collapse isOpened={this.state.isOpened}>
				<div style={{padding: theme.scale[2], paddingRight: 0, backgroundColor: theme.colors.black}}>
				{this.layerFromType(this.props.layer.type)}
				</div>
			</Collapse>
		</div>
	}
}

export class LayerEditor extends React.Component {
	static propTypes = {
    layers: React.PropTypes.array.isRequired,
    onLayersChanged: React.PropTypes.func.isRequired
  }

	constructor(props) {
		super(props)
	}

	onLayerDestroyed(deletedLayer) {
		let deleteIdx = -1
		for (let i = 0; i < this.props.layers.length; i++) {
				if(this.props.layers[i].id == deletedLayer.id) {
					deleteIdx = i
				}
		}

		const remainingLayers = this.props.layers
		const removedLayers = remainingLayers.splice(deleteIdx, 1)
		this.props.onLayersChanged(remainingLayers)
	}

	onLayerChanged(changedLayer) {
		let changedIdx = -1
		for (let i = 0; i < this.props.layers.length; i++) {
				if(this.props.layers[i].id == changedLayer.id) {
					changedIdx = i
				}
		}

		const changedLayers = this.props.layers
		changedLayers[changedIdx] = changedLayer
		this.props.onLayersChanged(changedLayers)
	}

	render() {
		const layerPanels = this.props.layers.map(layer => {
			return <LayerPanel
				key={layer.id}
				layer={layer}
				onLayerDestroyed={this.onLayerDestroyed.bind(this)}
				onLayerChanged={this.onLayerChanged.bind(this)}
			/>
		});

		return <div>
			<Toolbar style={{marginRight: 20}}>
				<NavItem>
					<Heading>Layers</Heading>
				</NavItem>
				<Space auto x={1} />
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
