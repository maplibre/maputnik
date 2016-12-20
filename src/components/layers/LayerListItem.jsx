import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Radium from 'radium'
import Immutable from 'immutable'
import Color from 'color'

import Heading from 'rebass/dist/Heading'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'

import LayerIcon from '../icons/LayerIcon'
import LayerEditor from './LayerEditor'
import {SortableElement, SortableHandle} from 'react-sortable-hoc'

import colors from '../../config/colors.js'
import { fontSizes, margins } from '../../config/scales.js'


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
        color: colors.lowgray,
        fontSize: fontSizes[5],
        borderBottom: 1,
        borderLeft: 2,
        borderRight: 0,
        borderStyle: "solid",
        userSelect: 'none',
        listStyle: 'none',
        zIndex: 2000,
        cursor: 'pointer',
        position: 'relative',
        padding: margins[1],
        borderColor: Color(colors.gray).lighten(0.1).string(),
        backgroundColor: colors.gray,
        ":hover": {
          backgroundColor: Color(colors.gray).lighten(0.15).string(),
        }
    }}>
      <LayerTypeDragHandle type={this.props.layerType} />
      <span>{this.props.layerId}</span>
    </li>
  }
}

export default Radium(LayerListItem);
