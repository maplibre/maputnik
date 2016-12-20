import React from 'react'
import Immutable from 'immutable'

import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'
import Tabs from 'react-simpletabs'

import SourceEditor from './SourceEditor'
import FilterEditor from '../filter/FilterEditor'
import PropertyGroup from '../fields/PropertyGroup'

import MdVisibility from 'react-icons/lib/md/visibility'
import MdVisibilityOff from 'react-icons/lib/md/visibility-off'
import MdDelete from 'react-icons/lib/md/delete'
import PureRenderMixin from 'react-addons-pure-render-mixin';

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
    sources: React.PropTypes.instanceOf(Immutable.Map),
    vectorLayers: React.PropTypes.instanceOf(Immutable.Map),
    onLayerChanged: React.PropTypes.func,
    onLayerDestroyed: React.PropTypes.func,
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
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  getChildContext () {
    return {
      reactIconBase: {
        size: theme.fontSizes[4],
        color: theme.colors.lowgray,
      }
    }
  }

  onPropertyChange(group, property, newValue) {
    const layer = this.props.layer
    console.log(group, property, newValue)
    const changedLayer = layer.setIn([group, property], newValue)
    this.props.onLayerChanged(changedLayer)
  }

  onFilterChange(newValue) {
    let layer = this.props.layer
    const changedLayer = layer.set('filter', newValue)
    this.props.onLayerChanged(changedLayer)
  }

  toggleVisibility() {
    if(this.props.layer.has('layout') && this.props.layer.getIn(['layout', 'visibility']) === 'none') {
      this.onLayoutChanged('visibility', 'visible')
    } else {
      this.onLayoutChanged('visibility', 'none')
    }
  }

  render() {
    const layerType = this.props.layer.get('type')
    const groups = layout[layerType].groups
    const propertyGroups = groups.map(group => {
      return <PropertyGroup
        key={this.props.group}
        layer={this.props.layer}
        groupFields={Immutable.OrderedSet(group.fields)}
        onChange={this.onPropertyChange.bind(this)}
      />
    })

    console.log(this.props.layer.toJSON())
    let visibleIcon = <MdVisibilityOff />
    if(this.props.layer.has('layout') && this.props.layer.getIn(['layout', 'visibility']) === 'none') {
      visibleIcon = <MdVisibility />
    }
    return <div style={{
        padding: theme.scale[0],
    }}>
      <Toolbar>
        <NavItem style={{fontWeight: 400}}>
          {this.props.layer.get('id')}
        </NavItem>
        <Space auto x={1} />
        <NavItem onClick={this.toggleVisibility.bind(this)}>
          {visibleIcon}
        </NavItem>
        <NavItem onClick={(e) => this.props.onLayerDestroyed(this.props.layer)}>
          <MdDelete />
        </NavItem>
      </Toolbar>
        {propertyGroups}
          <FilterEditor
            filter={this.props.layer.get('filter', Immutable.List()).toJSON()}
            properties={this.props.vectorLayers.get(this.props.layer.get('source-layer'))}
            onChange={f => this.onFilterChange(Immutable.fromJS(f))}
          />
           {this.props.layer.get('type') !== 'background'
             && <SourceEditor
              source={this.props.layer.get('source')}
              sourceLayer={this.props.layer.get('source-layer')}
              sources={this.props.sources}
              onSourceChange={console.log}
              onSourceLayerChange={console.log}
            />}
    </div>
  }
}
