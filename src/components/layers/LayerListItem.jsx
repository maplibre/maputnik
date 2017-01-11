import React from 'react'
import Color from 'color'
import classnames from 'classnames'

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
        width: fontSizes[4],
        height: fontSizes[4],
        paddingRight: margins[0],
      }}
    />
  }
}

class IconAction extends React.Component {
  static propTypes = {
    action: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
  }

  renderIcon() {
    switch(this.props.action) {
      case 'copy': return <CopyIcon />
      case 'show': return <VisibilityIcon />
      case 'hide': return <VisibilityOffIcon />
      case 'delete': return <DeleteIcon />
      default: return null
    }
  }

  render() {
    return <a
      className="maputnik-icon-action"
      onClick={this.props.onClick}
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
  }

  getChildContext() {
    return {
      reactIconBase: { size: fontSizes[4] }
    }
  }

  render() {
    return <li
      key={this.props.layerId}
      onClick={e => this.props.onLayerSelect(this.props.layerId)}
      className={classnames({
        "maputnik-layer-list-item": true,
        "maputnik-layer-list-item-selected": this.props.isSelected,
      })}>
        <LayerTypeDragHandle type={this.props.layerType} />
        <span className="maputnik-layer-list-item-id">{this.props.layerId}</span>
        <span style={{flexGrow: 1}} />
        <IconAction
          action={'delete'}
          onClick={e => this.props.onLayerDestroy(this.props.layerId)}
        />
        <IconAction
          action={'copy'}
          onClick={e => this.props.onLayerCopy(this.props.layerId)}
        />
        <IconAction
          action={this.props.visibility === 'visible' ? 'hide' : 'show'}
          onClick={e => this.props.onLayerVisibilityToggle(this.props.layerId)}
        />
    </li>
  }
}

export default LayerListItem;
