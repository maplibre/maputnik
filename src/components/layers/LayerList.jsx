import React from 'react'
import classnames from 'classnames'
import cloneDeep from 'lodash.clonedeep'

import Button from '../Button'
import LayerListGroup from './LayerListGroup'
import LayerListItem from './LayerListItem'
import AddIcon from 'react-icons/lib/md/add-circle-outline'
import AddModal from '../modals/AddModal'

import style from '../../libs/style.js'
import {SortableContainer, SortableHandle, arrayMove} from 'react-sortable-hoc';

const layerPrefix = name => name.replace(' ', '-').replace('_', '-').split('-')[0]

const layerListPropTypes = {
  layers: React.PropTypes.array.isRequired,
  selectedLayerIndex: React.PropTypes.number.isRequired,
  onLayersChange: React.PropTypes.func.isRequired,
  onLayerSelect: React.PropTypes.func,
  sources: React.PropTypes.object.isRequired,
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

  toggleLayerGroup(groupPrefix) {
    const newGroups = { ...this.state.collapsedGroups }
    if(groupPrefix in this.state.collapsedGroups) {
      newGroups[groupPrefix] = !this.state.collapsedGroups[groupPrefix]
    } else {
      newGroups[groupPrefix] = true
    }
    this.setState({
      collapsedGroups: newGroups
    })
  }

  render() {
    const isCollapsed = groupPrefix => {
      const collapsed = this.state.collapsedGroups[groupPrefix]
      return collapsed === undefined ? false : collapsed
    }

    const listItems = []
    let idx = 0
    this.groupedLayers().forEach(layers => {
      const groupPrefix = layerPrefix(layers[0].id)
      if(layers.length > 1) {
        const grp = <LayerListGroup
          key={'group-' + groupPrefix + '-' + idx}
          title={groupPrefix}
          isActive={!isCollapsed(groupPrefix)}
          onActiveToggle={this.toggleLayerGroup.bind(this, groupPrefix)}
        />
        listItems.push(grp)
      }

      layers.forEach(layer => {
        const listItem = <LayerListItem
          className={classnames({
            'maputnik-layer-list-item-collapsed': isCollapsed(groupPrefix)
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
        <span>Layers</span>
        <span className="maputnik-space" />
        <Button
          onClick={this.toggleModal.bind(this, 'add')}
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
