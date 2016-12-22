import React from 'react'

import SourceEditor from './SourceEditor'
import FilterEditor from '../filter/FilterEditor'
import PropertyGroup from '../fields/PropertyGroup'
import LayerEditorGroup from './LayerEditorGroup'

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
  }

  static defaultProps = {
    onLayerChanged: () => {},
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
    editorGroups['Source'] = true

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

  /** A {@property} in either the paint our layout {@group} has changed
   * to a {@newValue}.
   */
  onPropertyChange(group, property, newValue) {
    const changedLayer = {
      ...this.props.layer,
      [group]: {
        ...this.props.layer[group],
        [property]: newValue
      }
    }
    this.props.onLayerChanged(changedLayer)
  }

  onFilterChange(newValue) {
    const changedLayer = {
      ...this.props.layer,
      filter: newValue
    }
    this.props.onLayerChanged(changedLayer)
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

  render() {
    console.log('editor groups', this.state.editorGroups)
    const layerType = this.props.layer.type
    const groups = layout[layerType].groups
    const propertyGroups = groups.map(group => {
      return <LayerEditorGroup
        key={group.title}
        title={group.title}
        isActive={this.state.editorGroups[group.title]}
        onActiveToggle={this.onGroupToggle.bind(this, group.title)}
      >
        <PropertyGroup
          layer={this.props.layer}
          groupFields={group.fields}
          onChange={this.onPropertyChange.bind(this)}
        />
      </LayerEditorGroup>
    })

    let dataGroup = null
    if(this.props.layer.type !== 'background') {
      dataGroup = <LayerEditorGroup
        title="Source"
        isActive={this.state.editorGroups['Source']}
        onActiveToggle={this.onGroupToggle.bind(this, 'Source')}
      >
        <FilterEditor
          filter={this.props.layer.filter}
          properties={this.props.vectorLayers[this.props.layer['source-layer']]}
          onChange={f => this.onFilterChange(f)}
        />
        <SourceEditor
          source={this.props.layer.source}
          sourceLayer={this.props.layer['source-layer']}
          sources={this.props.sources}
          onSourceChange={console.log}
          onSourceLayerChange={console.log}
        />
      </LayerEditorGroup>
    }

    return <div>
      {propertyGroups}
      {dataGroup}
    </div>
  }
}
