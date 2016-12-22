import React from 'react'
import Color from 'color'

import CopyIcon from 'react-icons/lib/md/content-copy'
import VisibilityIcon from 'react-icons/lib/md/visibility'
import VisibilityOffIcon from 'react-icons/lib/md/visibility-off'
import DeleteIcon from 'react-icons/lib/md/delete'

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
      style={{
        cursor: 'move',
        width: 15,
        height: 15,
        paddingRight: margins[0],
      }}
    />
  }
}

class IconAction extends React.Component {
  static propTypes = {
    action: React.PropTypes.string.isRequired,
    active: React.PropTypes.bool,
    onClick: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { hover: false }
  }

  renderIcon() {
    const iconStyle = {
      fill: colors.black
    }

    if(this.props.active) {
      iconStyle.fill = colors.midgray
    }
    if(this.state.hover) {
      iconStyle.fill = colors.lowgray
    }

    switch(this.props.action) {
      case 'copy': return <CopyIcon style={iconStyle} />
      case 'show': return <VisibilityIcon style={iconStyle} />
      case 'hide': return <VisibilityOffIcon style={iconStyle} />
      case 'delete': return <DeleteIcon style={iconStyle} />
      default: return null
    }
  }

  render() {
    return <a
      style={{
        display: "inline",
        marginLeft: margins[0],
        ...this.props.style
      }}
      onClick={this.props.onClick}
      onMouseOver={e => this.setState({hover: true})}
      onMouseOut={e => this.setState({hover: false})}
    >
      {this.renderIcon()}
    </a>
  }
}

@SortableElement
class LayerListItem extends React.Component {
  static propTypes = {
    layerId: React.PropTypes.string.isRequired,
    layerType: React.PropTypes.string.isRequired,
    isSelected: React.PropTypes.bool,
    visibility: React.PropTypes.string,

    onLayerSelect: React.PropTypes.func.isRequired,
    onLayerCopy: React.PropTypes.func,
    onLayerDestroy: React.PropTypes.func,
    onLayerVisibilityToggle: React.PropTypes.func,
  }

  static defaultProps = {
    isSelected: false,
    visibility: 'visible',
    onLayerCopy: () => {},
    onLayerDestroy: () => {},
    onLayerVisibilityToggle: () => {},
  }

  static childContextTypes = {
    reactIconBase: React.PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
  }

  getChildContext() {
    return {
      reactIconBase: { size: 12 }
    }
  }

  render() {
    const itemStyle = {
      fontWeight: 400,
      color: colors.lowgray,
      fontSize: fontSizes[5],
      borderLeft: 0,
      borderTop: 0,
      borderBottom: 1,
      borderRight: 0,
      borderStyle: "solid",
      userSelect: 'none',
      listStyle: 'none',
      zIndex: 2000,
      cursor: 'pointer',
      position: 'relative',
      padding: margins[1],
      borderColor: Color(colors.black).lighten(0.10).string(),
      backgroundColor: colors.black,
    }

    if(this.state.hover) {
      itemStyle.backgroundColor = Color(colors.black).lighten(0.10).string()
    }

    if(this.props.isSelected) {
      itemStyle.backgroundColor = Color(colors.black).lighten(0.15).string()
    }

    const iconProps = {
      active: this.state.hover || this.props.isSelected
    }

    return <li
      key={this.props.layerId}
      onClick={e => this.props.onLayerSelect(this.props.layerId)}
      onMouseOver={e => this.setState({hover: true})}
      onMouseOut={e => this.setState({hover: false})}
      style={itemStyle}>
      <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <LayerTypeDragHandle type={this.props.layerType} />
        <span style={{
          width: 115,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>{this.props.layerId}</span>
        <span style={{flexGrow: 1}} />
        <IconAction {...iconProps}
          action={'delete'}
          onClick={e => this.props.onLayerDestroy(this.props.layerId)}
        />
        <IconAction {...iconProps}
          action={'copy'}
          onClick={e => this.props.onLayerCopy(this.props.layerId)}
        />
        <IconAction {...iconProps}
          active={this.state.hover || this.props.isSelected || this.props.visibility === 'none'}
          action={this.props.visibility === 'visible' ? 'hide' : 'show'}
          onClick={e => this.props.onLayerVisibilityToggle(this.props.layerId)}
        />
      </div>
    </li>
  }
}

export default LayerListItem;
