import React from 'react'
import Radium from 'radium'
import Immutable from 'immutable'
import color from 'color'

import Heading from 'rebass/dist/Heading'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'

import { LayerEditor } from './editor.jsx'
import scrollbars from '../scrollbars.scss'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import theme from '../theme.js'

@Radium
class LayerListItem extends React.Component {
  static propTypes = {
    layerId: React.PropTypes.number.isRequired,
    onLayerSelected: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return <div key={this.props.layerId} style={{
        borderBottom: 1,
        borderLeft: 2,
        borderRight: 0,
        borderStyle: "solid",
        borderColor: color(theme.colors.gray).lighten(0.1).hexString(),
    }}>
      <div
        onClick={() => this.props.onLayerSelected(this.props.layerId)}
        style={{
          backgroundColor: theme.colors.gray,
          ":hover": {
            backgroundColor: color(theme.colors.gray).lighten(0.15).hexString(),
          }
        }}
      >
        <NavItem style={{
          fontWeight: 400,
          color: theme.colors.lowgray,
        }}>
          #{this.props.layerId}
        </NavItem>
      </div>
    </div>
  }
}

export default Radium(LayerListItem);
