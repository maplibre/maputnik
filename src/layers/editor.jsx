import React from 'react'
import { Toolbar, NavItem, Space} from 'rebass'
import Collapse from 'react-collapse'
import theme from '../theme.js'
import FillLayer from './fill.jsx'
import LineLayer from './line.jsx'
import SymbolLayer from './line.jsx'
import BackgroundLayer from './background.jsx'

import MdVisibility from 'react-icons/lib/md/visibility'
import MdVisibilityOff from 'react-icons/lib/md/visibility-off'
import MdDelete from 'react-icons/lib/md/delete'

class UnsupportedLayer extends React.Component {
	render() {
		return <div></div>
	}
}

/** Layer editor supporting multiple types of layers. */
export class LayerEditor extends React.Component {
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
		const changedLayer = this.props.layer.setIn(['paint', property], newValue)
		this.props.onLayerChanged(changedLayer)
	}

	onLayoutChanged(property, newValue) {
		const changedLayer = this.props.layer.setIn(['layout', property], newValue)
		this.props.onLayerChanged(changedLayer)
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

		return <UnsupportedLayer />
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
				borderLeftColor: this.props.layer.getIn(['metadata', 'mapolo:color'])
			}}>
			<Toolbar onClick={this.toggleLayer.bind(this)}>
				<NavItem style={{fontWeight: 400}}>
					#{this.props.layer.get('id')}
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
				{this.layerFromType(this.props.layer.get('type'))}
				</div>
			</Collapse>
		</div>
	}
}

