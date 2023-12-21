import React from 'react'
import {GeoJSONSourceSpecification, RasterDEMSourceSpecification, RasterSourceSpecification, SourceSpecification, StyleSpecification, VectorSourceSpecification, latest} from '@maplibre/maplibre-gl-style-spec'
import Modal from './Modal'
import InputButton from './InputButton'
import FieldString from './FieldString'
import FieldSelect from './FieldSelect'
import ModalSourcesTypeEditor, { EditorMode } from './ModalSourcesTypeEditor'

import style from '../libs/style'
import { deleteSource, addSource, changeSource } from '../libs/source'
import publicSources from '../config/tilesets.json'

import {MdAddCircleOutline, MdDelete} from 'react-icons/md'

type PublicSourceProps = {
  id: string
  type: string
  title: string
  onSelect(...args: unknown[]): unknown
};

class PublicSource extends React.Component<PublicSourceProps> {
  render() {
    return <div className="maputnik-public-source">
            <InputButton
        className="maputnik-public-source-select"
                onClick={() => this.props.onSelect(this.props.id)}
            >
                <div className="maputnik-public-source-info">
                    <p className="maputnik-public-source-name">{this.props.title}</p>
                    <p className="maputnik-public-source-id">#{this.props.id}</p>
                </div>
                <span className="maputnik-space" />
                <MdAddCircleOutline />
            </InputButton>
    </div>
  }
}

function editorMode(source: SourceSpecification) {
  if(source.type === 'raster') {
    if(source.tiles) return 'tilexyz_raster'
    return 'tilejson_raster'
  }
  if(source.type === 'raster-dem') {
    if(source.tiles) return 'tilexyz_raster-dem'
    return 'tilejson_raster-dem'
  }
  if(source.type === 'vector') {
    if(source.tiles) return 'tilexyz_vector'
    return 'tilejson_vector'
  }
  if(source.type === 'geojson') {
    if (typeof(source.data) === "string") {
      return 'geojson_url';
    }
    else {
      return 'geojson_json';
    }
  }
  if(source.type === 'image') {
    return 'image';
  }
  if(source.type === 'video') {
    return 'video';
  }
  return null
}

type ActiveModalSourcesTypeEditorProps = {
  sourceId: string
  source: SourceSpecification
  onDelete(...args: unknown[]): unknown
  onChange(...args: unknown[]): unknown
};

class ActiveModalSourcesTypeEditor extends React.Component<ActiveModalSourcesTypeEditorProps> {
  render() {
    return <div className="maputnik-active-source-type-editor">
      <div className="maputnik-active-source-type-editor-header">
        <span className="maputnik-active-source-type-editor-header-id">#{this.props.sourceId}</span>
        <span className="maputnik-space" />
        <InputButton
          aria-label={`Remove '${this.props.sourceId}' source`}
          className="maputnik-active-source-type-editor-header-delete"
          onClick={()=> this.props.onDelete(this.props.sourceId)}
          style={{backgroundColor: 'transparent'}}
        >
          <MdDelete />
        </InputButton>
      </div>
      <div className="maputnik-active-source-type-editor-content">
        <ModalSourcesTypeEditor
          onChange={this.props.onChange}
          mode={editorMode(this.props.source)}
          source={this.props.source}
        />
      </div>
    </div>
  }
}

type AddSourceProps = {
  onAdd(...args: unknown[]): unknown
};

type AddSourceState = {
  mode: EditorMode
  sourceId: string
  source: SourceSpecification
};

class AddSource extends React.Component<AddSourceProps, AddSourceState> {
  constructor(props: AddSourceProps) {
    super(props)
    this.state = {
      mode: 'tilejson_vector',
      sourceId: style.generateId(),
      source: this.defaultSource('tilejson_vector'),
    }
  }

  defaultSource(mode: EditorMode): SourceSpecification {
    const source = (this.state || {}).source || {}
    const {protocol} = window.location;

    switch(mode) {
      case 'geojson_url': return {
        type: 'geojson',
        data: `${protocol}//localhost:3000/geojson.json`
      }
      case 'geojson_json': return {
        type: 'geojson',
        cluster: (source as GeoJSONSourceSpecification).cluster || false,
        data: {}
      }
      case 'tilejson_vector': return {
        type: 'vector',
        url: (source as VectorSourceSpecification).url || `${protocol}//localhost:3000/tilejson.json`
      }
      case 'tilexyz_vector': return {
        type: 'vector',
        tiles: (source as VectorSourceSpecification).tiles || [`${protocol}//localhost:3000/{x}/{y}/{z}.pbf`],
        minzoom: (source as VectorSourceSpecification).minzoom || 0,
        maxzoom: (source as VectorSourceSpecification).maxzoom || 14
      }
      case 'tilejson_raster': return {
        type: 'raster',
        url: (source as RasterSourceSpecification).url || `${protocol}//localhost:3000/tilejson.json`
      }
      case 'tilexyz_raster': return {
        type: 'raster',
        tiles: (source as RasterSourceSpecification).tiles || [`${protocol}//localhost:3000/{x}/{y}/{z}.pbf`],
        minzoom: (source as RasterSourceSpecification).minzoom || 0,
        maxzoom: (source as RasterSourceSpecification).maxzoom || 14
      }
      case 'tilejson_raster-dem': return {
        type: 'raster-dem',
        url: (source as RasterDEMSourceSpecification).url || `${protocol}//localhost:3000/tilejson.json`
      }
      case 'tilexyz_raster-dem': return {
        type: 'raster-dem',
        tiles: (source as RasterDEMSourceSpecification).tiles || [`${protocol}//localhost:3000/{x}/{y}/{z}.pbf`],
        minzoom: (source as RasterDEMSourceSpecification).minzoom || 0,
        maxzoom: (source as RasterDEMSourceSpecification).maxzoom || 14
      }
      case 'image': return {
        type: 'image',
        url: `${protocol}//localhost:3000/image.png`,
        coordinates: [
          [0,0],
          [0,0],
          [0,0],
          [0,0],
        ],
      }
      case 'video': return {
        type: 'video',
        urls: [
          `${protocol}//localhost:3000/movie.mp4`
        ],
        coordinates: [
          [0,0],
          [0,0],
          [0,0],
          [0,0],
        ],
      }
      default: return {} as any
    }
  }

  onAdd = () => {
    const {source, sourceId} = this.state;
    this.props.onAdd(sourceId, source);
  }

  onChangeSource = (source: SourceSpecification) => {
    this.setState({source});
  }

  render() {
    // Kind of a hack because the type changes, however maputnik has 1..n
    // options per type, for example
    //
    //  - 'geojson' - 'GeoJSON (URL)' and 'GeoJSON (JSON)'
    //  - 'raster' - 'Raster (TileJSON URL)' and 'Raster (XYZ URL)'
    //
    // So we just ignore the values entirely as they are self explanatory
    const sourceTypeFieldSpec = {
      doc: latest.source_vector.type.doc
    };

    return <div className="maputnik-add-source">
      <FieldString
        label={"Source ID"}
        fieldSpec={{doc: "Unique ID that identifies the source and is used in the layer to reference the source."}}
        value={this.state.sourceId}
        onChange={(v: string) => this.setState({ sourceId: v})}
      />
      <FieldSelect
        label={"Source Type"}
        fieldSpec={sourceTypeFieldSpec}
        options={[
          ['geojson_json', 'GeoJSON (JSON)'],
          ['geojson_url', 'GeoJSON (URL)'],
          ['tilejson_vector', 'Vector (TileJSON URL)'],
          ['tilexyz_vector', 'Vector (XYZ URLs)'],
          ['tilejson_raster', 'Raster (TileJSON URL)'],
          ['tilexyz_raster', 'Raster (XYZ URL)'],
          ['tilejson_raster-dem', 'Raster DEM (TileJSON URL)'],
          ['tilexyz_raster-dem', 'Raster DEM (XYZ URLs)'],
          ['image', 'Image'],
          ['video', 'Video'],
        ]}
        onChange={(mode: EditorMode) => this.setState({mode: mode, source: this.defaultSource(mode)})}
        value={this.state.mode as string}
      />
      <ModalSourcesTypeEditor
        onChange={this.onChangeSource}
        mode={this.state.mode}
        source={this.state.source}
      />
      <InputButton
        className="maputnik-add-source-button"
                onClick={this.onAdd}
      >
        Add Source
      </InputButton>
    </div>
  }
}

type ModalSourcesProps = {
  mapStyle: StyleSpecification
  isOpen: boolean
  onOpenToggle(...args: unknown[]): unknown
  onStyleChanged(...args: unknown[]): unknown
};

export default class ModalSources extends React.Component<ModalSourcesProps> {
  stripTitle(source: SourceSpecification & {title?: string}): SourceSpecification {
    const strippedSource = {...source}
    delete strippedSource['title']
    return strippedSource
  }

  render() {
    const mapStyle = this.props.mapStyle
    const activeSources = Object.keys(mapStyle.sources).map(sourceId => {
      const source = mapStyle.sources[sourceId]
      return <ActiveModalSourcesTypeEditor
        key={sourceId}
        sourceId={sourceId}
        source={source}
        onChange={(src: SourceSpecification) => this.props.onStyleChanged(changeSource(mapStyle, sourceId, src))}
        onDelete={() => this.props.onStyleChanged(deleteSource(mapStyle, sourceId))}
      />
    })

    const tilesetOptions = Object.keys(publicSources).filter((sourceId: string) => !(sourceId in mapStyle.sources)).map((sourceId: string) => {
      const source = publicSources[sourceId as keyof typeof publicSources] as SourceSpecification & {title: string};
      return <PublicSource
        key={sourceId}
        id={sourceId}
        type={source.type}
        title={source.title}
        onSelect={() => this.props.onStyleChanged(addSource(mapStyle, sourceId, this.stripTitle(source)))}
      />
    })

    return <Modal
      data-wd-key="modal:sources"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Sources'}
    >
      <section className="maputnik-modal-section">
        <h1>Active Sources</h1>
        {activeSources}
      </section>

      <section className="maputnik-modal-section">
        <h1>Choose Public Source</h1>
        <p>
          Add one of the publicly available sources to your style.
        </p>
        <div className="maputnik-public-sources" style={{maxWidth: 500}}>
        {tilesetOptions}
        </div>
      </section>

      <section className="maputnik-modal-section">
                <h1>Add New Source</h1>
                <p>Add a new source to your style. You can only choose the source type and id at creation time!</p>
                <AddSource
                    onAdd={(sourceId: string, source: SourceSpecification) => this.props.onStyleChanged(addSource(mapStyle, sourceId, source))}
                />
      </section>
    </Modal>
  }
}

