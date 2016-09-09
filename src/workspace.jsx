import React from 'react'
import { LayerEditor } from './layers.jsx'
import { SettingsEditor } from './settings.jsx'
import theme from './theme.js'

/** The workspace drawer contains the editor components depending on the context
 * chosen in the toolbar. */
export class WorkspaceDrawer extends React.Component {
	static propTypes = {
    workContext: React.PropTypes.oneOf(['layers', 'settings']).isRequired,
    styleManager: React.PropTypes.object.isRequired
  }

	render() {
		let workspaceContent = null

		if(this.props.workContext === "layers" && this.props.styleManager.mapStyle) {
			workspaceContent = <LayerEditor styleManager={this.props.styleManager}/>
		}

		if(this.props.workContext === "settings" && this.props.styleManager.mapStyle) {
			workspaceContent = <SettingsEditor styleManager={this.props.styleManager}/>
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
