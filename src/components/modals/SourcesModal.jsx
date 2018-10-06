import React from 'react'
import PropTypes from 'prop-types'
import {latest} from '@mapbox/mapbox-gl-style-spec'
import Modal from './Modal'
import Button from '../Button'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import SourceTypeEditor from '../sources/SourceTypeEditor'

import style from '../../libs/style'
import { deleteSource, addSource, changeSource } from '../../libs/source'
import publicSources from '../../config/tilesets.json'

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
			<Button
        className="maputnik-public-source-select"
				onClick={() => this.props.onSelect(this.props.id)}
			>
				<div className="maputnik-public-source-info">
					<p className="maputnik-public-source-name">{this.props.title}</p>
					<p className="maputnik-public-source-id">#{this.props.id}</p>
				</div>
				<span className="maputnik-space" />
				<MdAddCircleOutline />
			</Button>
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
  if(source.type === 'geojson') return 'geojson'
  return null
}

class ActiveSourceTypeEditor extends React.Component {
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
        <Button
          className="maputnik-active-source-type-editor-header-delete"
          onClick={()=> this.props.onDelete(this.props.sourceId)}
          style={{backgroundColor: 'transparent'}}
        >
          <MdDelete />
        </Button>
      </div>
      <div className="maputnik-active-source-type-editor-content">
        <SourceTypeEditor
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
    switch(mode) {
      case 'geojson': return {
        type: 'geojson',
        data: source.data || 'http://localhost:3000/geojson.json'
      }
      case 'tilejson_vector': return {
        type: 'vector',
        url: source.url || 'http://localhost:3000/tilejson.json'
      }
      case 'tilexyz_vector': return {
        type: 'vector',
        tiles: source.tiles || ['http://localhost:3000/{x}/{y}/{z}.pbf'],
        minZoom: source.minzoom || 0,
        maxZoom: source.maxzoom || 14
      }
      case 'tilejson_raster': return {
        type: 'raster',
        url: source.url || 'http://localhost:3000/tilejson.json'
      }
      case 'tilexyz_raster': return {
        type: 'raster',
        tiles: source.tiles || ['http://localhost:3000/{x}/{y}/{z}.pbf'],
        minzoom: source.minzoom || 0,
        maxzoom: source.maxzoom || 14
      }
      case 'tilejson_raster-dem': return {
        type: 'raster-dem',
        url: source.url || 'http://localhost:3000/tilejson.json'
      }
      case 'tilexyz_raster-dem': return {
        type: 'raster-dem',
        tiles: source.tiles || ['http://localhost:3000/{x}/{y}/{z}.pbf'],
        minzoom: source.minzoom || 0,
        maxzoom: source.maxzoom || 14
      }
      default: return {}
    }
  }

  render() {
    return <div className="maputnik-add-source">
      <InputBlock label={"Source ID"} doc={"Unique ID that identifies the source and is used in the layer to reference the source."}>
        <StringInput
          value={this.state.sourceId}
          onChange={v => this.setState({ sourceId: v})}
        />
      </InputBlock>
      <InputBlock label={"Source Type"} doc={latest.source_vector.type.doc}>
        <SelectInput
          options={[
            ['geojson', 'GeoJSON'],
            ['tilejson_vector', 'Vector (TileJSON URL)'],
            ['tilexyz_vector', 'Vector (XYZ URLs)'],
            ['tilejson_raster', 'Raster (TileJSON URL)'],
            ['tilexyz_raster', 'Raster (XYZ URL)'],
            ['tilejson_raster-dem', 'Raster DEM (TileJSON URL)'],
            ['tilexyz_raster-dem', 'Raster DEM (XYZ URLs)'],
          ]}
          onChange={mode => this.setState({mode: mode, source: this.defaultSource(mode)})}
          value={this.state.mode}
        />
      </InputBlock>
      <SourceTypeEditor
        onChange={src => this.setState({ source: src })}
        mode={this.state.mode}
        source={this.state.source}
      />
      <Button
        className="maputnik-add-source-button"
				onClick={() => this.props.onAdd(this.state.sourceId, this.state.source)}>
        Add Source
      </Button>
    </div>
  }
}

class SourcesModal extends React.Component {
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
      return <ActiveSourceTypeEditor
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
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Sources'}
    >
      <div className="maputnik-modal-section">
        <h4>Active Sources</h4>
        {activeSources}
      </div>

      <div className="maputnik-modal-section">
        <h4>Choose Public Source</h4>
        <p>
          Add one of the publicly available sources to your style.
        </p>
        <div className="maputnik-public-sources" style={{maxwidth: 500}}>
        {tilesetOptions}
        </div>
        <p>
          <strong>Note:</strong> Some of the tilesets are not optimised for online use, and as a result the file sizes of the tiles can be quite large (heavy) for online vector rendering. Please review any tilesets before use.
        </p>
      </div>

      <div className="maputnik-modal-section">
				<h4>Add New Source</h4>
				<p>Add a new source to your style. You can only choose the source type and id at creation time!</p>
				<AddSource
					onAdd={(sourceId, source) => this.props.onStyleChanged(addSource(mapStyle, sourceId, source))}
				/>
      </div>
    </Modal>
  }
}

export default SourcesModal
