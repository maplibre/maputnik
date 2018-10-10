import React from 'react'
import PropTypes from 'prop-types'
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton'

import JSONEditor from './JSONEditor'
import FilterEditor from '../filter/FilterEditor'
import PropertyGroup from '../fields/PropertyGroup'
import LayerEditorGroup from './LayerEditorGroup'
import LayerTypeBlock from './LayerTypeBlock'
import LayerIdBlock from './LayerIdBlock'
import MinZoomBlock from './MinZoomBlock'
import MaxZoomBlock from './MaxZoomBlock'
import CommentBlock from './CommentBlock'
import LayerSourceBlock from './LayerSourceBlock'
import LayerSourceLayerBlock from './LayerSourceLayerBlock'

import {MdMoreVert} from 'react-icons/md'

import { changeType, changeProperty } from '../../libs/layer'
import layout from '../../config/layout.json'


function layoutGroups(layerType) {
  const layerGroup = {
    title: 'Layer',
    type: 'layer'
  }
  const filterGroup = {
    title: 'Filter',
    type: 'filter'
  }
  const editorGroup = {
    title: 'JSON Editor',
    type: 'jsoneditor'
  }
  return [layerGroup, filterGroup].concat(layout[layerType].groups).concat([editorGroup])
}

/** Layer editor supporting multiple types of layers. */
export default class LayerEditor extends React.Component {
  static propTypes = {
    layer: PropTypes.object.isRequired,
    sources: PropTypes.object,
    vectorLayers: PropTypes.object,
    spec: PropTypes.object.isRequired,
    onLayerChanged: PropTypes.func,
    onLayerIdChange: PropTypes.func,
    onMoveLayer: PropTypes.func,
    onLayerDestroy: PropTypes.func,
    onLayerCopy: PropTypes.func,
    onLayerVisibilityToggle: PropTypes.func,
    isFirstLayer: PropTypes.bool,
    isLastLayer: PropTypes.bool,
    layerIndex: PropTypes.number,
  }

  static defaultProps = {
    onLayerChanged: () => {},
    onLayerIdChange: () => {},
    onLayerDestroyed: () => {},
  }

  static childContextTypes = {
    reactIconBase: PropTypes.object
  }

  constructor(props) {
    super(props)

    //TODO: Clean this up and refactor into function
    const editorGroups = {}
    layoutGroups(this.props.layer.type).forEach(group => {
      editorGroups[group.title] = true
    })

    this.state = { editorGroups }
  }

  static getDerivedStateFromProps(props, state) {
    const additionalGroups = { ...state.editorGroups }

    layout[props.layer.type].groups.forEach(group => {
      if(!(group.title in additionalGroups)) {
        additionalGroups[group.title] = true
      }
    })

    return {
      editorGroups: additionalGroups
    };
  }

  getChildContext () {
    return {
      reactIconBase: {
        size: 14,
        color: '#8e8e8e',
      }
    }
  }

  changeProperty(group, property, newValue) {
    this.props.onLayerChanged(changeProperty(this.props.layer, group, property, newValue))
  }

  onGroupToggle(groupTitle, active) {
    const changedActiveGroups = {
      ...this.state.editorGroups,
      [groupTitle]: active,
    }
    this.setState({
      editorGroups: changedActiveGroups
    })
  }

  renderGroupType(type, fields) {
    let comment = ""
    if(this.props.layer.metadata) {
      comment = this.props.layer.metadata['maputnik:comment']
    }

    let sourceLayerIds;
    if(this.props.sources.hasOwnProperty(this.props.layer.source)) {
      sourceLayerIds = this.props.sources[this.props.layer.source].layers;
    }

    switch(type) {
      case 'layer': return <div>
        <LayerIdBlock
          value={this.props.layer.id}
          wdKey="layer-editor.layer-id"
          onChange={newId => this.props.onLayerIdChange(this.props.layer.id, newId)}
        />
        <LayerTypeBlock
          value={this.props.layer.type}
          onChange={newType => this.props.onLayerChanged(changeType(this.props.layer, newType))}
        />
        {this.props.layer.type !== 'background' && <LayerSourceBlock
          sourceIds={Object.keys(this.props.sources)}
          value={this.props.layer.source}
          onChange={v => this.changeProperty(null, 'source', v)}
        />
        }
        {['background', 'raster', 'hillshade', 'heatmap'].indexOf(this.state.type) < 0 &&
        <LayerSourceLayerBlock
          sourceLayerIds={sourceLayerIds}
          value={this.props.layer['source-layer']}
          onChange={v => this.changeProperty(null, 'source-layer', v)}
        />
        }
        <MinZoomBlock
          value={this.props.layer.minzoom}
          onChange={v => this.changeProperty(null, 'minzoom', v)}
        />
        <MaxZoomBlock
          value={this.props.layer.maxzoom}
          onChange={v => this.changeProperty(null, 'maxzoom', v)}
        />
        <CommentBlock
          value={comment}
          onChange={v => this.changeProperty('metadata', 'maputnik:comment', v == ""  ? undefined : v)}
        />
      </div>
      case 'filter': return <div>
        <div className="maputnik-filter-editor-wrapper">
          <FilterEditor
            filter={this.props.layer.filter}
            properties={this.props.vectorLayers[this.props.layer['source-layer']]}
            onChange={f => this.changeProperty(null, 'filter', f)}
          />
        </div>
      </div>
      case 'properties': return <PropertyGroup
        layer={this.props.layer}
        groupFields={fields}
        spec={this.props.spec}
        onChange={this.changeProperty.bind(this)}
      />
      case 'jsoneditor': return <JSONEditor
        layer={this.props.layer}
        onChange={this.props.onLayerChanged}
      />
    }
  }

  moveLayer(offset) {
    this.props.onMoveLayer({
      oldIndex: this.props.layerIndex,
      newIndex: this.props.layerIndex+offset
    })
  }

  render() {
    const layerType = this.props.layer.type
    const groups = layoutGroups(layerType).filter(group => {
      return !(layerType === 'background' && group.type === 'source')
    }).map(group => {
      return <LayerEditorGroup
        data-wd-key={group.title}
        key={group.title}
        title={group.title}
        isActive={this.state.editorGroups[group.title]}
        onActiveToggle={this.onGroupToggle.bind(this, group.title)}
      >
        {this.renderGroupType(group.type, group.fields)}
      </LayerEditorGroup>
    })

    const layout = this.props.layer.layout || {}

    const items = {
      delete: {
        text: "Delete",
        handler: () => this.props.onLayerDestroy(this.props.layer.id)
      },
      duplicate: {
        text: "Duplicate",
        handler: () => this.props.onLayerCopy(this.props.layer.id)
      },
      hide: {
        text: (layout.visibility === "none") ? "Show" : "Hide",
        handler: () => this.props.onLayerVisibilityToggle(this.props.layer.id)
      },
      moveLayerUp: {
        text: "Move layer up",
        // Not actually used...
        disabled: this.props.isFirstLayer,
        handler: () => this.moveLayer(-1)
      },
      moveLayerDown: {
        text: "Move layer down",
        // Not actually used...
        disabled: this.props.isLastLayer,
        handler: () => this.moveLayer(+1)
      }
    }

    function handleSelection(id, event) {
      event.stopPropagation;
      items[id].handler();
    }

    return <div className="maputnik-layer-editor"
      >
      <header>
        <div className="layer-header">
          <h2 className="layer-header__title">
            Layer: {this.props.layer.id}
          </h2>
          <div className="layer-header__info">
            <Wrapper
              className='more-menu'
              onSelection={handleSelection}
              closeOnSelection={false}
            >
              <Button className='more-menu__button'>
                <MdMoreVert className="more-menu__button__svg" />
              </Button>
              <Menu>
                <ul className="more-menu__menu">
                  {Object.keys(items).map((id, idx) => {
                    const item = items[id];
                    return <li key={id}>
                      <MenuItem value={id} className='more-menu__menu__item'>
                        {item.text}
                      </MenuItem>
                    </li>
                  })}
                </ul>
              </Menu>
            </Wrapper>
          </div>
        </div>

      </header>
      {groups}
    </div>
  }
}
