import 'bootstrap/dist/css/bootstrap.min.css';
import {Workspace} from './workspace.jsx';
import {Map} from './map.jsx';
import {Toolbar} from './toolbar.jsx';
import React from 'react';
import styles from './layout.scss';
import { Drawer, Container, Block, Fixed } from 'rebass'
import { LayerEditor } from './layers.jsx'
import theme from './theme.jsx'

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
			  <Drawer style={{backgroundColor: theme.colors.gray, marginLeft: 60}} open={true} position="left">
					<LayerEditor />
        </Drawer>
				<div className={styles.layoutMap}>
					<Map />
				</div>
      </div>
    )
  }
}
