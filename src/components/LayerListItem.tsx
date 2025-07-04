import React from 'react'
import classnames from 'classnames'

import {MdContentCopy, MdVisibility, MdVisibilityOff, MdDelete} from 'react-icons/md'
import { IconContext } from 'react-icons'

import IconLayer from './IconLayer'
import {useSortable, type UseSortableArguments} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'


type DraggableLabelProps = {
  layerId: string
  layerType: string
  listeners: any
  attributes: Record<string, any>
};

function DraggableLabel(props: DraggableLabelProps) {
  return <div className="maputnik-layer-list-item-handle" {...props.attributes} {...(props.listeners as any)}>
    <IconLayer
      className="layer-handle__icon"
      type={props.layerType}
    />
    <button className="maputnik-layer-list-item-id">
      {props.layerId}
    </button>
  </div>
}

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
};

function LayerListItem(props: LayerListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.layerId} as UseSortableArguments);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;

  const visibilityAction = props.visibility === 'visible' ? 'show' : 'hide';

  return (
    <IconContext.Provider value={{size: '14px'}}>
      <li
        ref={setNodeRef}
        style={style}
        id={props.id}
        key={props.layerId}
        onClick={_e => props.onLayerSelect(props.layerIndex)}
        data-wd-key={"layer-list-item:"+props.layerId}
        className={classnames({
          "maputnik-layer-list-item": true,
          "maputnik-layer-list-item-selected": props.isSelected,
          [props.className!]: true,
        })}
      >
        <DraggableLabel layerId={props.layerId} layerType={props.layerType} listeners={listeners} attributes={attributes} />
        <span style={{flexGrow: 1}} />
        <IconAction
          wdKey={"layer-list-item:"+props.layerId+":delete"}
          action={'delete'}
          classBlockName="delete"
          onClick={_e => props.onLayerDestroy!(props.layerIndex)}
        />
        <IconAction
          wdKey={"layer-list-item:"+props.layerId+":copy"}
          action={'duplicate'}
          classBlockName="duplicate"
          onClick={_e => props.onLayerCopy!(props.layerIndex)}
        />
        <IconAction
          wdKey={"layer-list-item:"+props.layerId+":toggle-visibility"}
          action={visibilityAction}
          classBlockName="visibility"
          classBlockModifier={visibilityAction}
          onClick={_e => props.onLayerVisibilityToggle!(props.layerIndex)}
        />
      </li>
    </IconContext.Provider>
  );
}

LayerListItem.defaultProps = {
  isSelected: false,
  visibility: 'visible',
  onLayerCopy: () => {},
  onLayerDestroy: () => {},
  onLayerVisibilityToggle: () => {},
};

export default LayerListItem;
