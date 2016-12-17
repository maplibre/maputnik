import React from 'react'
import Immutable from 'immutable'

import Heading from 'rebass/dist/Heading'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'

import { LayerEditor } from './editor.jsx'
import scrollbars from '../scrollbars.scss'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import theme from '../theme.js'

// List of collapsible layer editors
export class LayerList extends React.Component {
  static propTypes = {
    layers: React.PropTypes.instanceOf(Immutable.OrderedMap),
    onLayersChanged: React.PropTypes.func.isRequired,
    onLayerSelected: React.PropTypes.func,
  }

  static defaultProps = {
    onLayerSelected: () => {},
  }

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  onLayerDestroyed(deletedLayer) {
    const remainingLayers = this.props.layers.delete(deletedLayer.get('id'))
    this.props.onLayersChanged(remainingLayers)
  }

  onLayerChanged(layer) {
    const changedLayers = this.props.layers.set(layer.get('id'), layer)
    this.props.onLayersChanged(changedLayers)
  }

  render() {
    var layerPanels = []
    layerPanels = this.props.layers.map(layer => {
      const layerId = layer.get('id')
      return <div key={layerId} style={{
          padding: theme.scale[0],
          borderBottom: 1,
          borderTop: 1,
          borderLeft: 2,
          borderRight: 0,
          borderStyle: "solid",
          borderColor: theme.borderColor
      }}>
        <Toolbar onClick={() => this.props.onLayerSelected(layerId)}>
          <NavItem style={{fontWeight: 400}}>
            #{layerId}
          </NavItem>
          <Space auto x={1} />
        </Toolbar>
      </div>
    }).toIndexedSeq()

    return <div>
      <div className={scrollbars.darkScrollbar} style={{
        overflowY: "scroll",
        bottom:0,
        left:0,
        right:0,
        top:1,
        position: "absolute",
      }}>
      {layerPanels}
      </div>
    </div>
  }
}
