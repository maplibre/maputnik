import React from 'react'
import PropTypes from 'prop-types'
import {latest} from '@mapbox/mapbox-gl-style-spec'
import Modal from './Modal'
import InputButton from './InputButton'
import Block from './Block'
import FieldString from './FieldString'
import FieldSelect from './FieldSelect'
import ModalSourcesTypeEditor from './ModalSourcesTypeEditor'

import style from '../libs/style'
import { deleteSource, addSource, changeSource } from '../libs/source'
import publicSources from '../config/tilesets.json'

import {MdAddCircleOutline, MdDelete} from 'react-icons/md'

class PublicSource extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  }

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

function editorMode(source) {
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

class ActiveModalSourcesTypeEditor extends React.Component {
  static propTypes = {
    sourceId: PropTypes.string.isRequired,
    source: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const inputProps = { }
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

class AddSource extends React.Component {
  static propTypes = {
    onAdd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      mode: 'tilejson_vector',
      sourceId: style.generateId(),
      source: this.defaultSource('tilejson_vector'),
    }
  }

  defaultSource(mode) {
    const source = (this.state || {}).source || {}
    const {protocol} = window.location;

    switch(mode) {
      case 'geojson_url': return {
        type: 'geojson',
        data: `${protocol}//localhost:3000/geojson.json`
      }
      case 'geojson_json': return {
        type: 'geojson',
        data: {}
      }
      case 'tilejson_vector': return {
        type: 'vector',
        url: source.url || `${protocol}//localhost:3000/tilejson.json`
      }
      case 'tilexyz_vector': return {
        type: 'vector',
        tiles: source.tiles || [`${protocol}//localhost:3000/{x}/{y}/{z}.pbf`],
        minZoom: source.minzoom || 0,
        maxZoom: source.maxzoom || 14
      }
      case 'tilejson_raster': return {
        type: 'raster',
        url: source.url || `${protocol}//localhost:3000/tilejson.json`
      }
      case 'tilexyz_raster': return {
        type: 'raster',
        tiles: source.tiles || [`${protocol}//localhost:3000/{x}/{y}/{z}.pbf`],
        minzoom: source.minzoom || 0,
        maxzoom: source.maxzoom || 14
      }
      case 'tilejson_raster-dem': return {
        type: 'raster-dem',
        url: source.url || `${protocol}//localhost:3000/tilejson.json`
      }
      case 'tilexyz_raster-dem': return {
        type: 'raster-dem',
        tiles: source.tiles || [`${protocol}//localhost:3000/{x}/{y}/{z}.pbf`],
        minzoom: source.minzoom || 0,
        maxzoom: source.maxzoom || 14
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
      default: return {}
    }
  }

  onAdd = () => {
    const {source, sourceId} = this.state;
    this.props.onAdd(sourceId, source);
  }

  onChangeSource = (source) => {
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
        onChange={v => this.setState({ sourceId: v})}
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
        onChange={mode => this.setState({mode: mode, source: this.defaultSource(mode)})}
        value={this.state.mode}
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

export default class ModalSources extends React.Component {
  static propTypes = {
    mapStyle: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
    onStyleChanged: PropTypes.func.isRequired,
  }

  stripTitle(source) {
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
        onChange={src => this.props.onStyleChanged(changeSource(mapStyle, sourceId, src))}
        onDelete={() => this.props.onStyleChanged(deleteSource(mapStyle, sourceId))}
      />
    })

    const tilesetOptions = Object.keys(publicSources).filter(sourceId => !(sourceId in mapStyle.sources)).map(sourceId => {
      const source = publicSources[sourceId]
      return <PublicSource
        key={sourceId}
        id={sourceId}
        type={source.type}
        title={source.title}
        onSelect={() => this.props.onStyleChanged(addSource(mapStyle, sourceId, this.stripTitle(source)))}
      />
    })

    const inputProps = { }
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
        <div className="maputnik-public-sources" style={{maxwidth: 500}}>
        {tilesetOptions}
        </div>
      </section>

      <section className="maputnik-modal-section">
				<h1>Add New Source</h1>
				<p>Add a new source to your style. You can only choose the source type and id at creation time!</p>
				<AddSource
					onAdd={(sourceId, source) => this.props.onStyleChanged(addSource(mapStyle, sourceId, source))}
				/>
      </section>
    </Modal>
  }
}

