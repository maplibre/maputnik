import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Heading from 'rebass/dist/Heading'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'

import LayerListItem from './LayerListItem'
import ScrollContainer from '../ScrollContainer'

import { margins } from '../../config/scales.js'

import {SortableContainer, SortableHandle, arrayMove} from 'react-sortable-hoc';

const layerListPropTypes = {
  layers: React.PropTypes.array.isRequired,
  onLayersChanged: React.PropTypes.func.isRequired,
  onLayerSelected: React.PropTypes.func,
}

// List of collapsible layer editors
@SortableContainer
class LayerListContainer extends React.Component {
  static propTypes = {...layerListPropTypes}
  static defaultProps = {
    onLayerSelected: () => {},
  }

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  onLayerDestroyed(deletedLayer) {
    const remainingLayers = this.props.layers.delete(deletedLayer.id)
    this.props.onLayersChanged(remainingLayers)
  }

  render() {
    const layerPanels = this.props.layers.map((layer, index) => {
      const layerId = layer.id
      return <LayerListItem
        index={index}
        key={layerId}
        layerId={layerId}
        layerType={layer.type}
        onLayerSelected={this.props.onLayerSelected}
      />
    })
    return <ScrollContainer>
      <ul style={{ padding: margins[1], margin: 0 }}>
        {layerPanels}
      </ul>
    </ScrollContainer>
  }
}

export default class LayerList extends React.Component {
  static propTypes = {...layerListPropTypes}

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  onSortEnd(move) {
    const { oldIndex, newIndex } = move
    if(oldIndex === newIndex) return
    let layers = this.props.layers.slice(0)
    layers = arrayMove(layers, oldIndex, newIndex)
    this.props.onLayersChanged(layers)
  }

  render() {
    return <LayerListContainer
      {...this.props}
      onSortEnd={this.onSortEnd.bind(this)}
      useDragHandle={true}
    />
  }
}
