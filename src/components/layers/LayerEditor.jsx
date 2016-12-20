import React from 'react'

import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'

import SourceEditor from './SourceEditor'
import FilterEditor from '../filter/FilterEditor'
import PropertyGroup from '../fields/PropertyGroup'

import ScrollContainer from '../ScrollContainer'

import layout from '../../config/layout.json'
import theme from '../../config/rebass.js'

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
    super(props);
  }

  getChildContext () {
    return {
      reactIconBase: {
        size: theme.fontSizes[4],
        color: theme.colors.lowgray,
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

  render() {
    const layerType = this.props.layer.type
    const groups = layout[layerType].groups
    const propertyGroups = groups.map(group => {
      return <PropertyGroup
        key={this.props.group}
        layer={this.props.layer}
        groupFields={group.fields}
        onChange={this.onPropertyChange.bind(this)}
      />
    })

    return <div style={{
        padding: theme.scale[0],
    }}>
      <Toolbar>
        <NavItem style={{fontWeight: 400}}>
          {this.props.layer.id}
        </NavItem>
      </Toolbar>
        {propertyGroups}
           {this.props.layer.type !== 'background' && <div>
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
          </div>}
    </div>
  }
}
