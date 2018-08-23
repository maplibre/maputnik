import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button'
import Modal from './Modal'

import LayerTypeBlock from '../layers/LayerTypeBlock'
import LayerIdBlock from '../layers/LayerIdBlock'
import LayerSourceBlock from '../layers/LayerSourceBlock'
import LayerSourceLayerBlock from '../layers/LayerSourceLayerBlock'

class AddModal extends React.Component {
  static propTypes = {
    layers: PropTypes.array.isRequired,
    onLayersChange: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onOpenToggle: PropTypes.func.isRequired,

    // A dict of source id's and the available source layers
    sources: PropTypes.object.isRequired,
  }

  addLayer = () => {
    const changedLayers = this.props.layers.slice(0)
    const layer = {
      id: this.state.id,
      type: this.state.type,
    }

    if(this.state.type !== 'background') {
      layer.source = this.state.source
      if(this.state.type !== 'raster' && this.state['source-layer']) {
        layer['source-layer'] = this.state['source-layer']
      }
    }

    changedLayers.push(layer)

    this.props.onLayersChange(changedLayers)
    this.props.onOpenToggle(false)
  }

  constructor(props) {
    super(props)
    this.state = {
      type: 'fill',
      id: '',
    }

    if(props.sources.length > 0) {
      this.state.source = Object.keys(this.props.sources)[0]
      this.state['source-layer'] = this.props.sources[this.state.source][0]
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // Check if source is valid for new type
    const oldType = this.state.type;
    const newType = nextState.type;

    const availableSourcesOld = this.getSources(oldType);
    const availableSourcesNew = this.getSources(newType);

    if(
      // Type has changed
      oldType !== newType
      && this.state.source !== ""
      // Was a valid source previously
      && availableSourcesOld.indexOf(this.state.source) > -1
      // And is not a valid source now
      && availableSourcesNew.indexOf(nextState.source) < 0
    ) {
      // Clear the source
      this.setState({
        source: ""
      });
    }
  }

  getLayersForSource(source) {
    const sourceObj = this.props.sources[source] || {};
    return sourceObj.layers || [];
  }

  getSources(type) {
    const sources = [];

    const types = {
      vector: [
        "fill",
        "line",
        "symbol",
        "circle",
        "fill-extrusion"
      ],
      raster: [
        "raster"
      ]
    }

    for(let [key, val] of Object.entries(this.props.sources)) {
      if(types[val.type] && types[val.type].indexOf(type) > -1) {
        sources.push(key);
      }
    }

    return sources;
  }


  render() {
    const sources = this.getSources(this.state.type);
    const layers = this.getLayersForSource(this.state.source);

    return <Modal
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Add Layer'}
      data-wd-key="modal:add-layer"
    >
      <div className="maputnik-add-layer">
      <LayerIdBlock
        value={this.state.id}
        wdKey="add-layer.layer-id"
        onChange={v => {
          this.setState({ id: v })
        }}
      />
      <LayerTypeBlock
        value={this.state.type}
        wdKey="add-layer.layer-type"
        onChange={v => this.setState({ type: v })}
      />
      {this.state.type !== 'background' &&
      <LayerSourceBlock
        sourceIds={sources}
        wdKey="add-layer.layer-source-block"
        value={this.state.source}
        onChange={v => this.setState({ source: v })}
      />
      }
      {['background', 'raster', 'hillshade', 'heatmap'].indexOf(this.state.type) < 0 &&
      <LayerSourceLayerBlock
        isFixed={true}
        sourceLayerIds={layers}
        value={this.state['source-layer']}
        onChange={v => this.setState({ 'source-layer': v })}
      />
      }
      <Button
        className="maputnik-add-layer-button"
        onClick={this.addLayer}
        data-wd-key="add-layer"
      >
        Add Layer
      </Button>
      </div>
    </Modal>
  }
}

export default AddModal
