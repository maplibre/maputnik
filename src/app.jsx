import {Workspace} from './workspace.jsx';
import {Map} from './map.jsx';
import {Toolbar} from './toolbar.jsx';
import React from 'react';
import styles from './layout.scss';
import { Drawer, Container, Block, Fixed } from 'rebass'
import { LayerEditor } from './layers.jsx'
import theme from './theme.jsx'

export class WorkspaceDrawer extends React.Component {
	render() {
		return <Container style={{
			zIndex: 100,
			position: "fixed",
			height: "100%",
			left: "60",
			width: 300,
			top: "0",
			bottom: "0",
			backgroundColor: theme.colors.gray}
		} >
			<LayerEditor />
		</Container>;
	}
}

export default class App extends React.Component {
  static childContextTypes = {
    rebass: React.PropTypes.object,
		reactIconBase: React.PropTypes.object
  }

  getChildContext () {
    return {
			rebass: theme,
			reactIconBase: {
        size: 20,
      }
		}
	}

  render() {
    return (
		<div>
			  <Toolbar />
				<WorkspaceDrawer />
				<div className={styles.layoutMap}>
					<Map />
				</div>
      </div>
    )
  }
}
