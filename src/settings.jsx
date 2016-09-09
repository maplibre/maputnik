import React from 'react'
import theme from './theme.js'
import { Container, Input, Toolbar, NavItem, Space } from 'rebass'

/** Edit global settings within a style such as the name */
export class SettingsEditor extends React.Component {
	static propTypes = {
    styleManager: React.PropTypes.object.isRequired
  }

	constructor(props) {
		super(props)
		this.state = {
			settings: this.props.styleManager.settings()
		}
	}

	onChange(property, e) {
		let settings = this.state.settings
		settings[property] = e.target.value
		this.props.styleManager[property] = settings[property]
		this.setState(settings)
	}

	render() {
		return <div>
			<Toolbar style={{marginRight: 20}}>
				<NavItem>
					Settings
				</NavItem>
				<Space auto x={1} />
			</Toolbar>
			<Container>
				<Input
					name="name"
					label="Name"
					value={this.state.settings.name}
					onChange={this.onChange.bind(this, "name")}
				/>
				<Input
					name="owner"
					label="Owner"
					value={this.state.settings.owner}
					onChange={this.onChange.bind(this, "owner")}
				/>
				<Input
					name="sprite"
					label="Sprite URL"
					value={this.state.settings.sprite}
					onChange={this.onChange.bind(this, "sprite")}
				/>
				<Input
					name="glyphs"
					label="Glyphs URL"
					value={this.state.settings.glyphs}
					onChange={this.onChange.bind(this, "glyphs")}
				/>
			</Container>
		</div>
	}
}
