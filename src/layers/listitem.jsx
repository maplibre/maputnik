import React from 'react'
import Radium from 'radium'
import Immutable from 'immutable'
import Color from 'color'

import Heading from 'rebass/dist/Heading'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'

import LayerIcon from '../icons/layer.jsx'
import { LayerEditor } from './editor.jsx'
import scrollbars from '../scrollbars.scss'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import theme from '../theme.js'
import {SortableElement, SortableHandle} from 'react-sortable-hoc';


@SortableHandle
class LayerTypeDragHandle extends React.Component {
  static propTypes = LayerIcon.propTypes

  render() {
    return <LayerIcon
      {...this.props}
      style={{width: 15, height: 15, paddingRight: 3}}
    />
  }
}

@SortableElement
@Radium
class LayerListItem extends React.Component {
  static propTypes = {
    layerId: React.PropTypes.string.isRequired,
    layerType: React.PropTypes.string.isRequired,
    onLayerSelected: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return <li
      key={this.props.layerId}
      onClick={() => this.props.onLayerSelected(this.props.layerId)}
      style={{
        fontWeight: 400,
        color: theme.colors.lowgray,
        fontSize: theme.fontSizes[5],
        borderBottom: 1,
        borderLeft: 2,
        borderRight: 0,
        borderStyle: "solid",
        userSelect: 'none',
        listStyle: 'none',
        zIndex: 2000,
        cursor: 'pointer',
        position: 'relative',
        padding: theme.scale[1],
        borderColor: Color(theme.colors.gray).lighten(0.1).string(),
        backgroundColor: theme.colors.gray,
        ":hover": {
          backgroundColor: Color(theme.colors.gray).lighten(0.15).string(),
        }
    }}>
      <LayerTypeDragHandle type={this.props.layerType} />
      <span>{this.props.layerId}</span>
    </li>
  }
}

export default Radium(LayerListItem);
