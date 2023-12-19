import React from 'react'
import PropTypes from 'prop-types'
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton'

import FieldJson from './FieldJson'
import FilterEditor from './FilterEditor'
import PropertyGroup from './PropertyGroup'
import LayerEditorGroup from './LayerEditorGroup'
import FieldType from './FieldType'
import FieldId from './FieldId'
import FieldMinZoom from './FieldMinZoom'
import FieldMaxZoom from './FieldMaxZoom'
import FieldComment from './FieldComment'
import FieldSource from './FieldSource'
import FieldSourceLayer from './FieldSourceLayer'
import {Accordion} from 'react-accessible-accordion';

import {MdMoreVert} from 'react-icons/md'

import { changeType, changeProperty } from '../libs/layer'
import layout from '../config/layout.json'
import {formatLayerId} from '../util/format';


function getLayoutForType (type) {
  return layout[type] ? layout[type] : layout.invalid;
}

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
  return [layerGroup, filterGroup]
    .concat(getLayoutForType(layerType).groups)
    .concat([editorGroup])
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
    errors: PropTypes.array,
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

    getLayoutForType(props.layer.type).groups.forEach(group => {
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
    this.props.onLayerChanged(
      this.props.layerIndex,
      changeProperty(this.props.layer, group, property, newValue)
    )
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
    const {errors, layerIndex} = this.props;

    const errorData = {};
    errors.forEach(error => {
      if (
        error.parsed &&
        error.parsed.type === "layer" &&
        error.parsed.data.index == layerIndex
      ) {
        errorData[error.parsed.data.key] = {
          message: error.parsed.data.message
        };
      }
    })

    let sourceLayerIds;
    if(this.props.sources.hasOwnProperty(this.props.layer.source)) {
      sourceLayerIds = this.props.sources[this.props.layer.source].layers;
    }

    switch(type) {
      case 'layer': return <div>
        <FieldId
          value={this.props.layer.id}
          wdKey="layer-editor.layer-id"
          error={errorData.id}
          onChange={newId => this.props.onLayerIdChange(this.props.layerIndex, this.props.layer.id, newId)}
        />
        <FieldType
          disabled={true}
          error={errorData.type}
          value={this.props.layer.type}
          onChange={newType => this.props.onLayerChanged(
            this.props.layerIndex,
            changeType(this.props.layer, newType)
          )}
        />
        {this.props.layer.type !== 'background' && <FieldSource
          error={errorData.source}
          sourceIds={Object.keys(this.props.sources)}
          value={this.props.layer.source}
          onChange={v => this.changeProperty(null, 'source', v)}
        />
        }
        {['background', 'raster', 'hillshade', 'heatmap'].indexOf(this.props.layer.type) < 0 &&
        <FieldSourceLayer
          error={errorData['source-layer']}
          sourceLayerIds={sourceLayerIds}
          value={this.props.layer['source-layer']}
          onChange={v => this.changeProperty(null, 'source-layer', v)}
        />
        }
        <FieldMinZoom
          error={errorData.minzoom}
          value={this.props.layer.minzoom}
          onChange={v => this.changeProperty(null, 'minzoom', v)}
        />
        <FieldMaxZoom
          error={errorData.maxzoom}
          value={this.props.layer.maxzoom}
          onChange={v => this.changeProperty(null, 'maxzoom', v)}
        />
        <FieldComment
          error={errorData.comment}
          value={comment}
          onChange={v => this.changeProperty('metadata', 'maputnik:comment', v == ""  ? undefined : v)}
        />
      </div>
      case 'filter': return <div>
        <div className="maputnik-filter-editor-wrapper">
          <FilterEditor
            errors={errorData}
            filter={this.props.layer.filter}
            properties={this.props.vectorLayers[this.props.layer['source-layer']]}
            onChange={f => this.changeProperty(null, 'filter', f)}
          />
        </div>
      </div>
      case 'properties':
        return <PropertyGroup
          errors={errorData}
          layer={this.props.layer}
          groupFields={fields}
          spec={this.props.spec}
          onChange={this.changeProperty.bind(this)}
        />
      case 'jsoneditor':
        return <FieldJson
          layer={this.props.layer}
          onChange={(layer) => {
            this.props.onLayerChanged(
              this.props.layerIndex,
              layer
            );
          }}
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
    const groupIds = [];
    const layerType = this.props.layer.type
    const groups = layoutGroups(layerType).filter(group => {
      return !(layerType === 'background' && group.type === 'source')
    }).map(group => {
      const groupId = group.title.replace(/ /g, "_");
      groupIds.push(groupId);
      return <LayerEditorGroup
        data-wd-key={group.title}
        id={groupId}
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
        handler: () => this.props.onLayerDestroy(this.props.layerIndex)
      },
      duplicate: {
        text: "Duplicate",
        handler: () => this.props.onLayerCopy(this.props.layerIndex)
      },
      hide: {
        text: (layout.visibility === "none") ? "Show" : "Hide",
        handler: () => this.props.onLayerVisibilityToggle(this.props.layerIndex)
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

    return <section className="maputnik-layer-editor"
      role="main"
      aria-label="Layer editor"
    >
      <header>
        <div className="layer-header">
          <h2 className="layer-header__title">
            Layer: {formatLayerId(this.props.layer.id)}
          </h2>
          <div className="layer-header__info">
            <Wrapper
              className='more-menu'
              onSelection={handleSelection}
              closeOnSelection={false}
            >
              <Button id="skip-target-layer-editor" data-wd-key="skip-target-layer-editor" className='more-menu__button' title="Layer options">
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
      <Accordion
        allowMultipleExpanded={true}
        allowZeroExpanded={true}
        preExpanded={groupIds}
      >
        {groups}
      </Accordion>
    </section>
  }
}
