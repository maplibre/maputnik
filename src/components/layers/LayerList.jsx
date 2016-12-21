import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import cloneDeep from 'lodash.clonedeep'

import LayerListItem from './LayerListItem'

import style from '../../libs/style.js'
import { margins } from '../../config/scales.js'

import {SortableContainer, SortableHandle, arrayMove} from 'react-sortable-hoc';

const layerListPropTypes = {
  layers: React.PropTypes.array.isRequired,
  selectedLayerIndex: React.PropTypes.number.isRequired,
  onLayersChange: React.PropTypes.func.isRequired,
  onLayerSelect: React.PropTypes.func,
}

// List of collapsible layer editors
@SortableContainer
class LayerListContainer extends React.Component {
  static propTypes = {...layerListPropTypes}
  static defaultProps = {
    onLayerSelect: () => {},
  }

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  onLayerDestroy(layerId) {
    const remainingLayers = this.props.layers.slice(0)
    const idx = style.indexOfLayer(remainingLayers, layerId)
    remainingLayers.splice(idx, 1);
    this.props.onLayersChange(remainingLayers)
  }

  onLayerCopy(layerId) {
    const changedLayers = this.props.layers.slice(0)
    const idx = style.indexOfLayer(changedLayers, layerId)

    const clonedLayer = cloneDeep(changedLayers[idx])
    clonedLayer.id = clonedLayer.id + "-copy"
    changedLayers.splice(idx, 0, clonedLayer)
    this.props.onLayersChange(changedLayers)
  }

  onLayerVisibilityToggle(layerId) {
    const changedLayers = this.props.layers.slice(0)
    const idx = style.indexOfLayer(changedLayers, layerId)

    const layer = { ...changedLayers[idx] }
    const changedLayout = 'layout' in layer ? {...layer.layout} : {}
    changedLayout.visibility = changedLayout.visibility === 'none' ? 'visible' : 'none'

    layer.layout = changedLayout
    changedLayers[idx] = layer
    this.props.onLayersChange(changedLayers)
  }

  render() {
    const layerPanels = this.props.layers.map((layer, index) => {
      const layerId = layer.id
      return <LayerListItem
        index={index}
        key={layerId}
        layerId={layerId}
        layerType={layer.type}
        visibility={(layer.layout || {}).visibility}
        isSelected={index === this.props.selectedLayerIndex}
        onLayerSelect={this.props.onLayerSelect}
        onLayerDestroy={this.onLayerDestroy.bind(this)}
        onLayerCopy={this.onLayerCopy.bind(this)}
        onLayerVisibilityToggle={this.onLayerVisibilityToggle.bind(this)}
      />
    })
    return <ul style={{ padding: margins[1], paddingRight: 0, margin: 0 }}>
      {layerPanels}
    </ul>
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
    this.props.onLayersChange(layers)
  }

  render() {
    return <LayerListContainer
      {...this.props}
      onSortEnd={this.onSortEnd.bind(this)}
      useDragHandle={true}
    />
  }
}
