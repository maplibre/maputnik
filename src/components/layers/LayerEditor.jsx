import React from 'react'

import GlSpec from 'mapbox-gl-style-spec/reference/latest.min.js'
import JSONEditor from './JSONEditor'
import FilterEditor from '../filter/FilterEditor'
import PropertyGroup from '../fields/PropertyGroup'
import LayerEditorGroup from './LayerEditorGroup'
import LayerTypeBlock from './LayerTypeBlock'
import LayerIdBlock from './LayerIdBlock'
import LayerSourceBlock from './LayerSourceBlock'
import LayerSourceLayerBlock from './LayerSourceLayerBlock'

import InputBlock from '../inputs/InputBlock'
import MultiButtonInput from '../inputs/MultiButtonInput'

import input from '../../config/input.js'
import { changeType, changeProperty } from '../../libs/layer'
import layout from '../../config/layout.json'
import { margins, fontSizes } from '../../config/scales'
import colors from '../../config/colors'

class UnsupportedLayer extends React.Component {
  render() {
    return <div></div>
  }
}

/** Layer editor supporting multiple types of layers. */
export default class LayerEditor extends React.Component {
  static propTypes = {
    layer: React.PropTypes.object.isRequired,
    sources: React.PropTypes.object,
    vectorLayers: React.PropTypes.object,
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
    layout[this.props.layer.type].groups.forEach(group => {
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
        size: fontSizes[4],
        color: colors.lowgray,
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
    switch(type) {
      case 'settings': return <div>
          <LayerIdBlock
            value={this.props.layer.id}
            onChange={newId => this.props.onLayerIdChange(this.props.layer.id, newId)}
          />
          <LayerTypeBlock
            value={this.props.layer.type}
            onChange={newType => this.props.onLayerChanged(changeType(this.props.layer, newType))}
          />
        </div>
      case 'source': return <div>
        <LayerSourceBlock
          sourceIds={Object.keys(this.props.sources)}
          value={this.props.layer.source}
          onChange={v => this.changeProperty(null, 'source', v)}
        />
        {this.props.layer.type !== 'raster' && <LayerSourceLayerBlock
          sourceLayerIds={this.props.sources[this.props.layer.source]}
          value={this.props.layer['source-layer']}
          onChange={v => this.changeProperty(null, 'source-layer', v)}
        />
        }
        <div style={input.property}>
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
    const layoutGroups = layout[layerType].groups.filter(group => {
      return !(this.props.layer.type === 'background' && group.type === 'source')
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

    return <div>
      {layoutGroups}
    </div>
  }
}
