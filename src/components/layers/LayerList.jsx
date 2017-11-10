import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import cloneDeep from 'lodash.clonedeep'

import Button from '../Button'
import LayerListGroup from './LayerListGroup'
import LayerListItem from './LayerListItem'
import AddIcon from 'react-icons/lib/md/add-circle-outline'
import AddModal from '../modals/AddModal'

import style from '../../libs/style.js'
import {SortableContainer, SortableHandle, arrayMove} from 'react-sortable-hoc';

const layerListPropTypes = {
  layers: PropTypes.array.isRequired,
  selectedLayerIndex: PropTypes.number.isRequired,
  onLayersChange: PropTypes.func.isRequired,
  onLayerSelect: PropTypes.func,
  sources: PropTypes.object.isRequired,
}

function layerPrefix(name) {
  return name.replace(' ', '-').replace('_', '-').split('-')[0]
}

function findClosestCommonPrefix(layers, idx) {
  const currentLayerPrefix = layerPrefix(layers[idx].id)
  let closestIdx = idx
  for (let i = idx; i > 0; i--) {
    const previousLayerPrefix = layerPrefix(layers[i-1].id)
    if(previousLayerPrefix === currentLayerPrefix) {
      closestIdx = i - 1
    } else {
      return closestIdx
    }
  }
  return closestIdx
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
    this.state = {
      collapsedGroups: {},
      isOpen: {
        add: false,
      }
    }
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

  toggleModal(modalName) {
    this.setState({
      isOpen: {
        ...this.state.isOpen,
        [modalName]: !this.state.isOpen[modalName]
      }
    })
  }

  groupedLayers() {
    const groups = []
    for (let i = 0; i < this.props.layers.length; i++) {
      const previousLayer = this.props.layers[i-1]
      const layer = this.props.layers[i]
      if(previousLayer && layerPrefix(previousLayer.id) == layerPrefix(layer.id)) {
        const lastGroup = groups[groups.length - 1]
        lastGroup.push(layer)
      } else {
        groups.push([layer])
      }
    }
    return groups
  }

  toggleLayerGroup(groupPrefix, idx) {
    const lookupKey = [groupPrefix, idx].join('-')
    const newGroups = { ...this.state.collapsedGroups }
    if(lookupKey in this.state.collapsedGroups) {
      newGroups[lookupKey] = !this.state.collapsedGroups[lookupKey]
    } else {
      newGroups[lookupKey] = false
    }
    this.setState({
      collapsedGroups: newGroups
    })
  }

  isCollapsed(groupPrefix, idx) {
    const collapsed = this.state.collapsedGroups[[groupPrefix, idx].join('-')]
    return collapsed === undefined ? true : collapsed
  }

  render() {

    const listItems = []
    let idx = 0
    this.groupedLayers().forEach(layers => {
      const groupPrefix = layerPrefix(layers[0].id)
      if(layers.length > 1) {
        const grp = <LayerListGroup
          data-wd-key={[groupPrefix, idx].join('-')}
          key={[groupPrefix, idx].join('-')}
          title={groupPrefix}
          isActive={!this.isCollapsed(groupPrefix, idx)}
          onActiveToggle={this.toggleLayerGroup.bind(this, groupPrefix, idx)}
        />
        listItems.push(grp)
      }

      layers.forEach((layer, idxInGroup) => {
        const groupIdx = findClosestCommonPrefix(this.props.layers, idx)
        const listItem = <LayerListItem
          className={classnames({
            'maputnik-layer-list-item-collapsed': layers.length > 1 && this.isCollapsed(groupPrefix, groupIdx),
            'maputnik-layer-list-item-group-last': idxInGroup == layers.length - 1 && layers.length > 1
          })}
          index={idx}
          key={layer.id}
          layerId={layer.id}
          layerType={layer.type}
          visibility={(layer.layout || {}).visibility}
          isSelected={idx === this.props.selectedLayerIndex}
          onLayerSelect={this.props.onLayerSelect}
          onLayerDestroy={this.onLayerDestroy.bind(this)}
          onLayerCopy={this.onLayerCopy.bind(this)}
          onLayerVisibilityToggle={this.onLayerVisibilityToggle.bind(this)}
        />
        listItems.push(listItem)
        idx += 1
      })
    })

    return <div className="maputnik-layer-list">
      <AddModal
          layers={this.props.layers}
          sources={this.props.sources}
          isOpen={this.state.isOpen.add}
          onOpenToggle={this.toggleModal.bind(this, 'add')}
          onLayersChange={this.props.onLayersChange}
      />
      <header className="maputnik-layer-list-header">
        <span className="maputnik-layer-list-header-title">Layers</span>
        <span className="maputnik-space" />
        <Button
          onClick={this.toggleModal.bind(this, 'add')}
          data-wd-key="layer-list:add-layer"
          className="maputnik-add-layer">
      Add Layer
      </Button>
      </header>
      <ul className="maputnik-layer-list-container">
        {listItems}
      </ul>
    </div>
  }
}

export default class LayerList extends React.Component {
  static propTypes = {...layerListPropTypes}

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
