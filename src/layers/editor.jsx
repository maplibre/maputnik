import React from 'react'
import Immutable from 'immutable'

import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'

import Collapse from 'react-collapse'
import theme from '../theme.js'
import FillLayer from './fill.jsx'
import LineLayer from './line.jsx'
import SymbolLayer from './symbol.jsx'
import BackgroundLayer from './background.jsx'

import MdVisibility from 'react-icons/lib/md/visibility'
import MdVisibilityOff from 'react-icons/lib/md/visibility-off'
import MdDelete from 'react-icons/lib/md/delete'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class UnsupportedLayer extends React.Component {
  render() {
    return <div></div>
  }
}

/** Layer editor supporting multiple types of layers. */
export class LayerEditor extends React.Component {
  static propTypes = {
    layer: React.PropTypes.object.isRequired,
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

  onPaintChanged(property, newValue) {
    let layer = this.props.layer
    //TODO: by using immutable records we can avoid this checking if object exists
    if(!layer.has('paint')) {
      layer = layer.set('paint', Immutable.Map())
    }

    const changedLayer = layer.setIn(['paint', property], newValue)
    this.props.onLayerChanged(changedLayer)
  }

  onLayoutChanged(property, newValue) {
    let layer = this.props.layer
    //TODO: by using immutable records we can avoid this checking if object exists
    if(!layer.has('layout')) {
      layer = layer.set('layout', Immutable.Map())
    }

    const changedLayer = layer.setIn(['layout', property], newValue)
    this.props.onLayerChanged(changedLayer)
  }

  layerFromType(type) {
    if (type === "fill") {
      return <FillLayer
        layer={this.props.layer}
        onPaintChanged={this.onPaintChanged.bind(this)}
        onLayoutChanged={this.onLayoutChanged.bind(this)}
      />
    }

    if (type === "background") {
      return <BackgroundLayer
        layer={this.props.layer}
        onPaintChanged={this.onPaintChanged.bind(this)}
        onLayoutChanged={this.onLayoutChanged.bind(this)}
      />
    }

    if (type === "line") {
      return <LineLayer
        layer={this.props.layer}
        onPaintChanged={this.onPaintChanged.bind(this)}
        onLayoutChanged={this.onLayoutChanged.bind(this)}
      />
    }

    if (type === "symbol") {
      return <SymbolLayer
        layer={this.props.layer}
        onPaintChanged={this.onPaintChanged.bind(this)}
        onLayoutChanged={this.onLayoutChanged.bind(this)}
      />
    }

    return <UnsupportedLayer />
  }

  toggleVisibility() {
    if(this.props.layer.has('layout') && this.props.layer.getIn(['layout', 'visibility']) === 'none') {
      this.onLayoutChanged('visibility', 'visible')
    } else {
      this.onLayoutChanged('visibility', 'none')
    }
  }

  render() {
    let visibleIcon = <MdVisibilityOff />
    if(this.props.layer.has('layout') && this.props.layer.getIn(['layout', 'visibility']) === 'none') {
      visibleIcon = <MdVisibility />
    }

    return <div style={{
        padding: theme.scale[0],
      }}>
      <Toolbar>
        <NavItem style={{fontWeight: 400}}>
          #{this.props.layer.get('id')}
        </NavItem>
        <Space auto x={1} />
        <NavItem onClick={this.toggleVisibility.bind(this)}>
          {visibleIcon}
        </NavItem>
        <NavItem onClick={(e) => this.props.onLayerDestroyed(this.props.layer)}>
          <MdDelete />
        </NavItem>
      </Toolbar>
      <div style={{padding: theme.scale[2], paddingRight: 0, backgroundColor: theme.colors.black}}>
      {this.layerFromType(this.props.layer.get('type'))}
      </div>
    </div>
  }
}

