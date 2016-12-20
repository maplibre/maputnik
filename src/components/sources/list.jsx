import React from 'react'

import Heading from 'rebass/dist/Heading'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'

import { SourceEditor } from './editor.jsx'
import scrollbars from '../scrollbars.scss'
import PureRenderMixin from 'react-addons-pure-render-mixin';

// List of collapsible layer editors
export class SourceList extends React.Component {
	static propTypes = {
		sources: React.PropTypes.object.isRequired,
		onSourcesChanged: React.PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	onSourceChanged(sourceId, changedSource) {
		const changedSources = this.props.sources.set(sourceId, changedSource)
		this.props.onSourcesChanged(changedSources)
	}

	render() {
		const sourceEditors = this.props.sources.map((source, sourceId) => {
			return <SourceEditor
				key={sourceId}
				sourceId={sourceId}
				source={source}
				onSourceChanged={this.onSourceChanged.bind(this)}
			/>
		}).toIndexedSeq()

		return <div>
			<Toolbar style={{marginRight: 20}}>
				<NavItem>
					<Heading>Sources</Heading>
				</NavItem>
				<Space auto x={1} />
			</Toolbar>
			{sourceEditors}
		</div>
	}
}
