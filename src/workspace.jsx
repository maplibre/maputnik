import React from 'react'
import { LayerEditor } from './layers.jsx'
import { SettingsEditor } from './settings.jsx'
import theme from './theme.js'

/** The workspace drawer contains the editor components depending on the edit
 * context chosen in the toolbar. It holds the state of the layers.*/
export class WorkspaceDrawer extends React.Component {
	static propTypes = {
		mapStyle: React.PropTypes.object.isRequired,
		onStyleChanged: React.PropTypes.func.isRequired,
    workContext: React.PropTypes.oneOf(['layers', 'settings']).isRequired,
  }

	onLayersChanged(changedLayers) {
		const changedStyle = this.props.mapStyle.set('layers', changedLayers)
		this.props.onStyleChanged(changedStyle)
	}

	render() {
		let workspaceContent = null

		if(this.props.workContext === "layers") {
			workspaceContent = <LayerEditor
				onLayersChanged={this.onLayersChanged.bind(this)}
				layers={this.props.mapStyle.get('layers')}
			/>
		}

		if(this.props.workContext === "settings") {
			workspaceContent = <SettingsEditor
				onStyleChanged={this.props.onStyleChanged}
				mapStyle={this.props.mapStyle}
			/>
		}

		return <div style={{
			zIndex: 100,
			position: "fixed",
			left: 60,
			width: 300,
			top: 0,
			bottom: 0,
			overflow: "hidden",
			backgroundColor: theme.colors.gray}
		}>
			{workspaceContent}
		</div>
	}
}
