import React from 'react'

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

import InputBlock from '../inputs/InputBlock'
import MultiButtonInput from '../inputs/MultiButtonInput'

import { changeType, changeProperty } from '../../libs/layer'
import layout from '../../config/layout.json'

class UnsupportedLayer extends React.Component {
  render() {
    return <div></div>
  }
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
    return [layerGroup, filterGroup].concat(layout[layerType].groups).concat([editorGroup])
}

/** Layer editor supporting multiple types of layers. */
export default class LayerEditor extends React.Component {
  static propTypes = {
    layer: React.PropTypes.object.isRequired,
    sources: React.PropTypes.object,
    vectorLayers: React.PropTypes.object,
    spec: React.PropTypes.object.isRequired,
    onLayerChanged: React.PropTypes.func,
    onLayerIdChange: React.PropTypes.func,
  }

  static defaultProps = {
    onLayerChanged: () => {},
    onLayerIdChange: () => {},
    onLayerDestroyed: () => {},
  }

  static childContextTypes = {
    reactIconBase: React.PropTypes.object
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

  componentWillReceiveProps(nextProps) {
    const additionalGroups = { ...this.state.editorGroups }

    layout[nextProps.layer.type].groups.forEach(group => {
      if(!(group.title in additionalGroups)) {
        additionalGroups[group.title] = true
      }
    })

    this.setState({
      editorGroups: additionalGroups
    })
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

    switch(type) {
      case 'layer': return <div>
        <LayerIdBlock
          value={this.props.layer.id}
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
        {this.props.layer.type !== 'raster' && this.props.layer.type !== 'background' && <LayerSourceLayerBlock
          sourceLayerIds={this.props.sources[this.props.layer.source]}
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
      default: return null
    }
  }

  render() {
    const layerType = this.props.layer.type
    const groups = layoutGroups(layerType).filter(group => {
      return !(layerType === 'background' && group.type === 'source')
    }).map(group => {
      return <LayerEditorGroup
        key={group.title}
        title={group.title}
        isActive={this.state.editorGroups[group.title]}
        onActiveToggle={this.onGroupToggle.bind(this, group.title)}
      >
        {this.renderGroupType(group.type, group.fields)}
      </LayerEditorGroup>
    })

    return <div className="maputnik-layer-editor"
      >
      {groups}
    </div>
  }
}
