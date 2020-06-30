import React from 'react'
import PropTypes from 'prop-types'
import {latest} from '@mapbox/mapbox-gl-style-spec'
import Block from './Block'
import FieldUrl from './FieldUrl'
import FieldNumber from './FieldNumber'
import FieldSelect from './FieldSelect'
import FieldDynamicArray from './FieldDynamicArray'
import FieldArray from './FieldArray'
import FieldJson from './FieldJson'


class TileJSONSourceEditor extends React.Component {
  static propTypes = {
    source: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
  }

  render() {
    return <div>
      <FieldUrl
        label={"TileJSON URL"}
        fieldSpec={latest.source_vector.url}
        value={this.props.source.url}
        onChange={url => this.props.onChange({
          ...this.props.source,
          url: url
        })}
      />
      {this.props.children}
    </div>
  }
}

class TileURLSourceEditor extends React.Component {
  static propTypes = {
    source: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
  }

  changeTileUrls(tiles) {
    this.props.onChange({
      ...this.props.source,
      tiles,
    })
  }

  renderTileUrls() {
    const tiles = this.props.source.tiles || [];
    return <FieldDynamicArray
      label={"Tile URL"}
      fieldSpec={latest.source_vector.tiles}
      type="url"
      value={tiles}
      onChange={this.changeTileUrls.bind(this)}
    />
  }

  render() {
    return <div>
      {this.renderTileUrls()}
      <FieldNumber
        label={"Min Zoom"}
        fieldSpec={latest.source_vector.minzoom}
        value={this.props.source.minzoom || 0}
        onChange={minzoom => this.props.onChange({
          ...this.props.source,
          minzoom: minzoom
        })}
      />
      <FieldNumber
        label={"Max Zoom"}
        fieldSpec={latest.source_vector.maxzoom}
        value={this.props.source.maxzoom || 22}
        onChange={maxzoom => this.props.onChange({
          ...this.props.source,
          maxzoom: maxzoom
        })}
      />
      {this.props.children}
  </div>

  }
}

class ImageSourceEditor extends React.Component {
  static propTypes = {
    source: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const changeCoord = (idx, val) => {
      const coordinates = this.props.source.coordinates.slice(0);
      coordinates[idx] = val;

      this.props.onChange({
        ...this.props.source,
        coordinates,
      });
    }

    return <div>
      <FieldUrl
        label={"Image URL"}
        fieldSpec={latest.source_image.url}
        value={this.props.source.url}
        onChange={url => this.props.onChange({
          ...this.props.source,
          url,
        })}
      />
      {["top left", "top right", "bottom right", "bottom left"].map((label, idx) => {
        return (
          <FieldArray
            label={`Coord ${label}`}
            key={label}
            length={2}
            type="number"
            value={this.props.source.coordinates[idx]}
            default={[0, 0]}
            onChange={(val) => changeCoord(idx, val)}
          />
        );
      })}
    </div>
  }
}

class VideoSourceEditor extends React.Component {
  static propTypes = {
    source: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const changeCoord = (idx, val) => {
      const coordinates = this.props.source.coordinates.slice(0);
      coordinates[idx] = val;

      this.props.onChange({
        ...this.props.source,
        coordinates,
      });
    }

    const changeUrls = (urls) => {
      this.props.onChange({
        ...this.props.source,
        urls,
      });
    }

    return <div>
      <FieldDynamicArray
        label={"Video URL"}
        fieldSpec={latest.source_video.urls}
        type="string"
        value={this.props.source.urls}
        default={""}
        onChange={changeUrls}
      />
      {["top left", "top right", "bottom right", "bottom left"].map((label, idx) => {
        return (
          <FieldArray
            label={`Coord ${label}`}
            key={label}
            length={2}
            type="number"
            value={this.props.source.coordinates[idx]}
            default={[0, 0]}
            onChange={val => changeCoord(idx, val)}
          />
        );
      })}
    </div>
  }
}

class GeoJSONSourceUrlEditor extends React.Component {
  static propTypes = {
    source: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    return <FieldUrl
      label={"GeoJSON URL"}
      fieldSpec={latest.source_geojson.data}
      value={this.props.source.data}
      onChange={data => this.props.onChange({
        ...this.props.source,
        data: data
      })}
    />
  }
}

class GeoJSONSourceFieldJsonEditor extends React.Component {
  static propTypes = {
    source: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    return <Block label={"GeoJSON"} fieldSpec={latest.source_geojson.data}>
      <FieldJson
        layer={this.props.source.data}
        maxHeight={200}
        mode={{
          name: "javascript",
          json: true
        }}
        lint={true}
        onChange={data => {
          this.props.onChange({
            ...this.props.source,
            data,
          })
        }}
      />
    </Block>
  }
}

export default class ModalSourcesTypeEditor extends React.Component {
  static propTypes = {
    mode: PropTypes.string.isRequired,
    source: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const commonProps = {
      source: this.props.source,
      onChange: this.props.onChange,
    }
    switch(this.props.mode) {
      case 'geojson_url': return <GeoJSONSourceUrlEditor {...commonProps} />
      case 'geojson_json': return <GeoJSONSourceFieldJsonEditor {...commonProps} />
      case 'tilejson_vector': return <TileJSONSourceEditor {...commonProps} />
      case 'tilexyz_vector': return <TileURLSourceEditor {...commonProps} />
      case 'tilejson_raster': return <TileJSONSourceEditor {...commonProps} />
      case 'tilexyz_raster': return <TileURLSourceEditor {...commonProps} />
      case 'tilejson_raster-dem': return <TileJSONSourceEditor {...commonProps} />
      case 'tilexyz_raster-dem': return <TileURLSourceEditor {...commonProps}>
        <FieldSelect
          label={"Encoding"}
          fieldSpec={latest.source_raster_dem.encoding}
          options={Object.keys(latest.source_raster_dem.encoding.values)}
          onChange={encoding => this.props.onChange({
            ...this.props.source,
            encoding: encoding
          })}
          value={this.props.source.encoding || latest.source_raster_dem.encoding.default}
        />
      </TileURLSourceEditor>
      case 'image': return <ImageSourceEditor {...commonProps} />
      case 'video': return <VideoSourceEditor {...commonProps} />
      default: return null
    }
  }
}

