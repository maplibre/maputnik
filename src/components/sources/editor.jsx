import React from 'react'

import Input from 'rebass/dist/Input'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'

import Collapse from 'react-collapse'
import PureRenderMixin from 'react-addons-pure-render-mixin';

import theme from '../theme.js'


class UnsupportedSource extends React.Component {
	render() {
		return <div></div>
	}
}

class VectorSource extends React.Component {
	static propTypes = {
		source: React.PropTypes.object.isRequired,
		onSourceChanged: React.PropTypes.func.isRequired,
  }

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	render() {
		return <div>
			<Input
				onChange={e => this.props.onSourceChanged(this.props.source.set('url', e.target.value))}
				name="url" label="TileJSON url"
				value={this.props.source.get("url")}
				/>
			<Input name="minzoom" label="Minimum zoom level" value={this.props.source.get("minzoom")} />
			<Input name="maxzoom" label="Maximum zoom level" value={this.props.source.get("maxzoom")} />
		</div>
	}
}

export class SourceEditor extends React.Component {
	static propTypes = {
		sourceId: React.PropTypes.string.isRequired,
		source: React.PropTypes.object.isRequired,
		onSourceChanged: React.PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props);
			this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
			this.state = {
				isOpened: false,
		}
	}

	toggleLayer() {
		this.setState({isOpened: !this.state.isOpened})
	}

	sourceFromType(type) {
		if (type === "vector") {
			return <VectorSource
				onSourceChanged={s => this.props.onSourceChanged(this.props.sourceId, s)}
				source={this.props.source}
			/>
		}
		return <UnsupportedSource />
	}

	render() {
		return <div style={{
				padding: theme.scale[0],
				borderBottom: 1,
				borderTop: 1,
				borderLeft: 2,
				borderRight: 0,
				borderStyle: "solid",
				borderColor: theme.borderColor,
			}}>
			<Toolbar onClick={this.toggleLayer.bind(this)}>
				<NavItem style={{fontWeight: 400}}>
					#{this.props.sourceId}
				</NavItem>
				<Space auto x={1} />
			</Toolbar>
			<Collapse isOpened={this.state.isOpened}>
				<div style={{padding: theme.scale[2], paddingRight: 0, backgroundColor: theme.colors.black}}>
				{this.sourceFromType(this.props.source.get('type'))}
				</div>
			</Collapse>
		</div>
	}
}

