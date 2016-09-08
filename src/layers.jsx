import React from 'react'
import ScrollArea from 'react-scrollbar'

import { Checkbox, Slider, Switch, Input, Panel, PanelHeader, Toolbar, NavItem, Tooltip, Container, Space} from 'rebass'
import { Button, Text } from 'rebass'
import Collapse from 'react-collapse'

import theme from './theme.js'

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
			<PanelHeader onClick={this.toggleLayer} inverted theme="default">{this.props.layer.id}</PanelHeader>
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
			<Toolbar>
				<NavItem is="a"> Toolbar </NavItem>
			</Toolbar>
			<ScrollArea speed={0.8} horizontal={false}>{layerPanels}</ScrollArea>
		</div>
	}
}
