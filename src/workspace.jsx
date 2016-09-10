import React from 'react'
import { LayerList } from './layers/list.jsx'
import { SettingsEditor } from './settings.jsx'
import { colors, fullHeight } from './theme.js'

/** The workspace drawer contains the editor components depending on the edit
 * context chosen in the toolbar. It holds the state of the layers.*/
export class WorkspaceDrawer extends React.Component {
	static propTypes = {
		mapStyle: React.PropTypes.object.isRequired,
		onStyleChanged: React.PropTypes.func.isRequired,
		workContext: React.PropTypes.oneOf(['layers', 'settings']).isRequired,
		accessToken: React.PropTypes.string,
		onAccessTokenChanged: React.PropTypes.func,
	}

	onLayersChanged(changedLayers) {
		const changedStyle = this.props.mapStyle.set('layers', changedLayers)
		this.props.onStyleChanged(changedStyle)
	}

	render() {
		let workspaceContent = null

		if(this.props.workContext === "layers") {
			workspaceContent = <LayerList
				onLayersChanged={this.onLayersChanged.bind(this)}
				layers={this.props.mapStyle.get('layers')}
			/>
		}

		if(this.props.workContext === "settings") {
			workspaceContent = <SettingsEditor
				onStyleChanged={this.props.onStyleChanged}
				mapStyle={this.props.mapStyle}
				accessToken={this.props.accessToken}
				onAccessTokenChanged={this.props.onAccessTokenChanged}
			/>
		}

		return <div style={{
			...fullHeight,
			zIndex: 100,
			left: 60,
			width: 300,
			overflow: "hidden",
			backgroundColor: colors.gray}
		}>
			{workspaceContent}
		</div>
	}
}
