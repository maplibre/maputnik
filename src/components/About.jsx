import React from 'react'
import theme from './theme.js'

import Heading from 'rebass/dist/Heading'
import Container from 'rebass/dist/Container'
import Input from 'rebass/dist/Input'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'

import Immutable from 'immutable'
import PureRenderMixin from 'react-addons-pure-render-mixin';

/** About page with basic infos and links to github repo */
export class About extends React.Component {
	static propTypes = {}

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	render() {
		return <div>
			<Toolbar style={{marginRight: 20}}>
				<NavItem>
					<Heading>About</Heading>
				</NavItem>
			</Toolbar>
			<Container>
				<h3>Maputnik – Visual Map Editor for Mapbox GL</h3>
			  <p>
					A free and open visual editor for the Mapbox GL styles targeted at developers and map designers. Creating your own custom map is easy with Maputnik.
				</p>
				<p>
				  The source code is openly licensed and available on <a href="https://github.com/maputnik/editor">GitHub</a>.
				</p>
			</Container>
    </div>
	}
}
