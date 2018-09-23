import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import CopyIcon from 'react-icons/lib/md/content-copy'
import VisibilityIcon from 'react-icons/lib/md/visibility'
import VisibilityOffIcon from 'react-icons/lib/md/visibility-off'
import DeleteIcon from 'react-icons/lib/md/delete'

import LayerIcon from '../icons/LayerIcon'
import {SortableElement, SortableHandle} from 'react-sortable-hoc'

@SortableHandle
class LayerTypeDragHandle extends React.Component {
  static propTypes = LayerIcon.propTypes

  render() {
    return <LayerIcon
      {...this.props}
      style={{
        cursor: 'move',
        width: 14,
        height: 14,
        paddingRight: 3,
      }}
    />
  }
}

class IconAction extends React.Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    wdKey: PropTypes.string,
    classBlockName: PropTypes.string,
  }

  renderIcon() {
    switch(this.props.action) {
      case 'duplicate': return <CopyIcon />
      case 'show': return <VisibilityIcon />
      case 'hide': return <VisibilityOffIcon />
      case 'delete': return <DeleteIcon />
    }
  }

  render() {
    let classAdditions = '';
    if (this.props.classBlockName) {
      classAdditions = `maputnik-layer-list-icon-action__${this.props.classBlockName}`;
    }

    return <button
      tabIndex="-1"
      title={this.props.action}
      className={`maputnik-layer-list-icon-action ${classAdditions}`}
      data-wd-key={this.props.wdKey}
      onClick={this.props.onClick}
    >
      {this.renderIcon()}
    </button>
  }
}

@SortableElement
class LayerListItem extends React.Component {
  static propTypes = {
    layerId: PropTypes.string.isRequired,
    layerType: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    visibility: PropTypes.string,
    className: PropTypes.string,

    onLayerSelect: PropTypes.func.isRequired,
    onLayerCopy: PropTypes.func,
    onLayerDestroy: PropTypes.func,
    onLayerVisibilityToggle: PropTypes.func,
  }

  static defaultProps = {
    isSelected: false,
    visibility: 'visible',
    onLayerCopy: () => {},
    onLayerDestroy: () => {},
    onLayerVisibilityToggle: () => {},
  }

  static childContextTypes = {
    reactIconBase: PropTypes.object
  }

  getChildContext() {
    return {
      reactIconBase: { size: 14 }
    }
  }

  render() {
    return <li
      key={this.props.layerId}
      onClick={e => this.props.onLayerSelect(this.props.layerId)}
      data-wd-key={"layer-list-item:"+this.props.layerId}
      className={classnames({
        "maputnik-layer-list-item": true,
        "maputnik-layer-list-item-selected": this.props.isSelected,
        [this.props.className]: true,
      })}>
        <LayerTypeDragHandle type={this.props.layerType} />
        <span className="maputnik-layer-list-item-id">{this.props.layerId}</span>
        <span style={{flexGrow: 1}} />
        <IconAction
          wdKey={"layer-list-item:"+this.props.layerId+":delete"}
          action={'delete'}
          classBlockName="delete"
          onClick={e => this.props.onLayerDestroy(this.props.layerId)}
        />
        <IconAction
          wdKey={"layer-list-item:"+this.props.layerId+":copy"}
          action={'duplicate'}
          classBlockName="duplicate"
          onClick={e => this.props.onLayerCopy(this.props.layerId)}
        />
        <IconAction
          wdKey={"layer-list-item:"+this.props.layerId+":toggle-visibility"}
          action={this.props.visibility === 'visible' ? 'hide' : 'show'}
          classBlockName="visibility"
          onClick={e => this.props.onLayerVisibilityToggle(this.props.layerId)}
        />
    </li>
  }
}

export default LayerListItem;
