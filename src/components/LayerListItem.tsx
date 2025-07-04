import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import {MdContentCopy, MdVisibility, MdVisibilityOff, MdDelete} from 'react-icons/md'

import IconLayer from './IconLayer'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'


type DraggableLabelProps = {
  layerId: string
  layerType: string
  dragAttributes?: React.HTMLAttributes<HTMLElement>
  dragListeners?: React.HTMLAttributes<HTMLElement>
};

const DraggableLabel = (props: DraggableLabelProps) => {
  const {dragAttributes, dragListeners} = props;
  return <div className="maputnik-layer-list-item-handle" {...dragAttributes} {...dragListeners}>
    <IconLayer
      className="layer-handle__icon"
      type={props.layerType}
    />
    <button className="maputnik-layer-list-item-id">
      {props.layerId}
    </button>
  </div>
};

type IconActionProps = {
  action: string
  onClick(...args: unknown[]): unknown
  wdKey?: string
  classBlockName?: string
  classBlockModifier?: string
};

class IconAction extends React.Component<IconActionProps> {
  renderIcon() {
    switch(this.props.action) {
    case 'duplicate': return <MdContentCopy />
    case 'show': return <MdVisibility />
    case 'hide': return <MdVisibilityOff />
    case 'delete': return <MdDelete />
    }
  }

  render() {
    const {classBlockName, classBlockModifier} = this.props;

    let classAdditions = '';
    if (classBlockName) {
      classAdditions = `maputnik-layer-list-icon-action__${classBlockName}`;

      if (classBlockModifier) {
        classAdditions += ` maputnik-layer-list-icon-action__${classBlockName}--${classBlockModifier}`;
      }
    }

    return <button
      tabIndex={-1}
      title={this.props.action}
      className={`maputnik-layer-list-icon-action ${classAdditions}`}
      data-wd-key={this.props.wdKey}
      onClick={this.props.onClick}
      aria-hidden="true"
    >
      {this.renderIcon()}
    </button>
  }
}

type LayerListItemProps = {
  id?: string
  layerIndex: number
  layerId: string
  layerType: string
  isSelected?: boolean
  visibility?: string
  className?: string
  onLayerSelect(...args: unknown[]): unknown
  onLayerCopy?(...args: unknown[]): unknown
  onLayerDestroy?(...args: unknown[]): unknown
  onLayerVisibilityToggle?(...args: unknown[]): unknown
  dragAttributes?: React.HTMLAttributes<HTMLElement>
  dragListeners?: React.HTMLAttributes<HTMLElement>
  dragRef?: (node: HTMLElement | null) => void
  dragStyle?: React.CSSProperties
};

class LayerListItem extends React.Component<LayerListItemProps> {
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
    const visibilityAction = this.props.visibility === 'visible' ? 'show' : 'hide';

    return <li
      ref={this.props.dragRef}
      style={this.props.dragStyle}
      id={this.props.id}
      onClick={_e => this.props.onLayerSelect(this.props.layerIndex)}
      data-wd-key={"layer-list-item:"+this.props.layerId}
      className={classnames({
        "maputnik-layer-list-item": true,
        "maputnik-layer-list-item-selected": this.props.isSelected,
        [this.props.className!]: true,
      })}>
      <DraggableLabel
        layerId={this.props.layerId}
        layerType={this.props.layerType}
        dragAttributes={this.props.dragAttributes}
        dragListeners={this.props.dragListeners}
      />
      <span style={{flexGrow: 1}} />
      <IconAction
        wdKey={"layer-list-item:"+this.props.layerId+":delete"}
        action={'delete'}
        classBlockName="delete"
        onClick={_e => this.props.onLayerDestroy!(this.props.layerIndex)}
      />
      <IconAction
        wdKey={"layer-list-item:"+this.props.layerId+":copy"}
        action={'duplicate'}
        classBlockName="duplicate"
        onClick={_e => this.props.onLayerCopy!(this.props.layerIndex)}
      />
      <IconAction
        wdKey={"layer-list-item:"+this.props.layerId+":toggle-visibility"}
        action={visibilityAction}
        classBlockName="visibility"
        classBlockModifier={visibilityAction}
        onClick={_e => this.props.onLayerVisibilityToggle!(this.props.layerIndex)}
      />
    </li>
  }
}

export default function LayerListItemSortable(props: LayerListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id!});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;

  return <LayerListItem
    {...props}
    dragAttributes={attributes}
    dragListeners={listeners}
    dragRef={setNodeRef}
    dragStyle={style}
  />;
}
