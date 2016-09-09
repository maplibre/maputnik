import React from 'react'

import { Heading, Checkbox, Slider, Switch, Input, Panel, PanelHeader, Toolbar, NavItem, Tooltip, Container, Space} from 'rebass'
import { Button, Text } from 'rebass'
import Collapse from 'react-collapse'
import theme from './theme.js'
import scrollbars from './scrollbars.scss'

export class FillLayer extends React.Component {
	render() {
		return <div>
			<Checkbox name="fill-antialias" label="Antialias" checked={this.props.paint["fill-antialias"]} />
			<Input name="fill-opacity" label="Opacity" defaultValue={this.props.paint["fill-opacity"]} />
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
	constructor(props) {
		super(props);
		this.toggleLayer = this.toggleLayer.bind(this);
		this.state = {
			isOpened: false
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

		return <Panel>
			<PanelHeader onClick={this.toggleLayer} theme="default">
				#{this.props.layer.id}
			</PanelHeader>
			<Collapse isOpened={this.state.isOpened}>
				{layer}
			</Collapse>
		</Panel>
	}
}

export class LayerEditor extends React.Component {
	render() {
		const layerPanels = this.props.layers.map(layer => {
			return <LayerPanel key={layer.id} layer={layer} />
		});
		return <div>
			<Heading level={2}>Layers</Heading>
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
