import React from 'react'
import theme from './theme.js'
import { Heading, Container, Input, Toolbar, NavItem, Space } from 'rebass'
import Immutable from 'immutable'
import PureRenderMixin from 'react-addons-pure-render-mixin';

/** Edit global settings within a style such as the name */
export class SettingsEditor extends React.Component {
	static propTypes = {
		mapStyle: React.PropTypes.instanceOf(Immutable.Map).isRequired,
		onStyleChanged: React.PropTypes.func.isRequired,
		accessToken: React.PropTypes.string,
		onAccessTokenChanged: React.PropTypes.func
	}

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	onChange(property, e) {
		const changedStyle = this.props.mapStyle.set(property, e.target.value)
		this.props.onStyleChanged(changedStyle)
	}

	render() {
		return <div>
			<Toolbar style={{marginRight: 20}}>
				<NavItem>
					<Heading>Settings</Heading>
				</NavItem>
			</Toolbar>
			<Container>
				<Input
					name="access-token"
					label="Mapbox GL access token"
					value={this.props.accessToken}
					onChange={e => this.props.onAccessTokenChanged(e.target.value)}
				/>
				<Input
					name="name"
					label="Name"
					value={this.props.mapStyle.get('name')}
					onChange={this.onChange.bind(this, "name")}
				/>
				<Input
					name="owner"
					label="Owner"
					value={this.props.mapStyle.get('owner')}
					onChange={this.onChange.bind(this, "owner")}
				/>
				<Input
					name="sprite"
					label="Sprite URL"
					value={this.props.mapStyle.get('sprite')}
					onChange={this.onChange.bind(this, "sprite")}
				/>
				<Input
					name="glyphs"
					label="Glyphs URL"
					value={this.props.mapStyle.get('glyphs')}
					onChange={this.onChange.bind(this, "glyphs")}
				/>
			</Container>
		</div>
	}
}
