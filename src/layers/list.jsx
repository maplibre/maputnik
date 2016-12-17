import React from 'react'
import Immutable from 'immutable'

import Heading from 'rebass/dist/Heading'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'

import { LayerEditor } from './editor.jsx'
import LayerListItem from './listitem.jsx'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import theme from '../theme.js'
import ScrollContainer from '../scrollcontainer.jsx'

import {SortableContainer, SortableHandle, arrayMove} from 'react-sortable-hoc';

const layerListPropTypes = {
  layers: React.PropTypes.instanceOf(Immutable.OrderedMap),
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
    const remainingLayers = this.props.layers.delete(deletedLayer.get('id'))
    this.props.onLayersChanged(remainingLayers)
  }

  onLayerChanged(layer) {
    const changedLayers = this.props.layers.set(layer.get('id'), layer)
    this.props.onLayersChanged(changedLayers)
  }

  render() {
    const layerPanels = this.props.layers.toIndexedSeq().map((layer, index) => {
      const layerId = layer.get('id')
      return <LayerListItem
        index={index}
        key={layerId}
        layerId={layerId}
        onLayerSelected={this.props.onLayerSelected}
      />
    })
    return <ScrollContainer>
      <ul style={{ padding: theme.scale[2] }}>
        {layerPanels}
      </ul>
    </ScrollContainer>
  }
}

export class LayerList extends React.Component {
  static propTypes = {...layerListPropTypes}

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  onSortEnd(move) {
    const { oldIndex, newIndex } = move
    if(oldIndex === newIndex) return

    //TODO: Implement this more performant for immutable collections
    // instead of converting back and forth
    let layers = this.props.layers.toArray()
    layers = arrayMove(layers, oldIndex, newIndex)
    layers = Immutable.OrderedMap(layers.map(l => [l.get('id'), l]))

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
