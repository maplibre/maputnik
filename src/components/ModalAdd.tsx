import React from 'react'

import InputButton from './InputButton'
import Modal from './Modal'
import FieldType from './FieldType'
import FieldId from './FieldId'
import FieldSource from './FieldSource'
import FieldSourceLayer from './FieldSourceLayer'
import type {LayerSpecification, SourceSpecification} from 'maplibre-gl'
import { WithTranslation, withTranslation } from 'react-i18next';
import { NON_SOURCE_LAYERS } from '../libs/non-source-layers'

type ModalAddInternalProps = {
  layers: LayerSpecification[]
  onLayersChange(layers: LayerSpecification[]): unknown
  isOpen: boolean
  onOpenToggle(open: boolean): unknown
  // A dict of source id's and the available source layers
  sources: Record<string, SourceSpecification & {layers: string[]}>;
} & WithTranslation;

type ModalAddState = {
  type: LayerSpecification["type"]
  id: string
  source?: string
  'source-layer'?: string
  error?: string | null
};

class ModalAddInternal extends React.Component<ModalAddInternalProps, ModalAddState> {
  addLayer = () => {
    if (this.props.layers.some(l => l.id === this.state.id)) {
      this.setState({ error: this.props.t('Layer ID already exists') })
      return
    }

    const changedLayers = this.props.layers.slice(0)
    const layer: ModalAddState = {
      id: this.state.id,
      type: this.state.type,
    }

    if(this.state.type !== 'background') {
      layer.source = this.state.source
      if(!NON_SOURCE_LAYERS.includes(this.state.type) && this.state['source-layer']) {
        layer['source-layer'] = this.state['source-layer']
      }
    }

    changedLayers.push(layer as LayerSpecification)
    this.setState({ error: null }, () => {
      this.props.onLayersChange(changedLayers)
      this.props.onOpenToggle(false)
    })
  }

  constructor(props: ModalAddInternalProps) {
    super(props)
    const state: ModalAddState = {
      type: 'fill',
      id: '',
      error: null,
    }

    if(Object.keys(props.sources).length > 0) {
      state.source = Object.keys(this.props.sources)[0];
      const sourceLayers = this.props.sources[state.source].layers || []
      if (sourceLayers.length > 0) {
        state['source-layer'] = sourceLayers[0];
      }
    }
    this.state = state;
  }

  componentDidUpdate(_prevProps: ModalAddInternalProps, prevState: ModalAddState) {
    // Check if source is valid for new type
    const oldType = prevState.type;
    const newType = this.state.type;

    const availableSourcesOld = this.getSources(oldType);
    const availableSourcesNew = this.getSources(newType);

    if(
    // Type has changed
      oldType !== newType
      && prevState.source !== ""
      // Was a valid source previously
      && availableSourcesOld.indexOf(prevState.source!) > -1
      // And is not a valid source now
      && availableSourcesNew.indexOf(this.state.source!) < 0
    ) {
      // Clear the source
      this.setState({
        source: ""
      });
    }
  }

  getLayersForSource(source: string) {
    const sourceObj = this.props.sources[source] || {};
    return sourceObj.layers || [];
  }

  getSources(type: LayerSpecification["type"]) {

    switch(type) {
    case 'background':
      return [];
    case 'hillshade':
    case 'color-relief':
      return Object.entries(this.props.sources).filter(([_, v]) => v.type === 'raster-dem').map(([k, _]) => k);
    case 'raster':
      return Object.entries(this.props.sources).filter(([_, v]) => v.type === 'raster').map(([k, _]) => k);
    case 'heatmap':
    case 'circle':
    case 'fill':
    case 'fill-extrusion':
    case 'line':
    case 'symbol':
      return Object.entries(this.props.sources).filter(([_, v]) => v.type === 'vector' || v.type === 'geojson').map(([k, _]) => k);
    default:
      return [];
    }
  }


  render() {
    const t = this.props.t;
    const sources = this.getSources(this.state.type);
    const layers = this.getLayersForSource(this.state.source!);
    let errorElement;
    if (this.state.error) {
      errorElement = (
        <div className="maputnik-modal-error">
          {this.state.error}
          <a
            href="#"
            onClick={() => this.setState({ error: null })}
            className="maputnik-modal-error-close"
          >
            ×
          </a>
        </div>
      );
    }

    return <Modal
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={t('Add Layer')}
      data-wd-key="modal:add-layer"
      className="maputnik-add-modal"
    >
      {errorElement}
      <div className="maputnik-add-layer">
        <FieldId
          value={this.state.id}
          wdKey="add-layer.layer-id"
          onChange={(v: string) => {
            this.setState({ id: v, error: null })
          }}
        />
        <FieldType
          value={this.state.type}
          wdKey="add-layer.layer-type"
          onChange={(v: LayerSpecification["type"]) => this.setState({ type: v })}
        />
        {this.state.type !== 'background' &&
      <FieldSource
        sourceIds={sources}
        wdKey="add-layer.layer-source-block"
        value={this.state.source}
        onChange={(v: string) => this.setState({ source: v })}
      />
        }
        {!NON_SOURCE_LAYERS.includes(this.state.type) &&
      <FieldSourceLayer
        isFixed={true}
        sourceLayerIds={layers}
        value={this.state['source-layer']}
        onChange={(v: string) => this.setState({ 'source-layer': v })}
      />
        }
        <InputButton
          className="maputnik-add-layer-button"
          onClick={this.addLayer}
          data-wd-key="add-layer"
        >
          {t("Add Layer")}
        </InputButton>
      </div>
    </Modal>
  }
}

const ModalAdd = withTranslation()(ModalAddInternal);
export default ModalAdd;
