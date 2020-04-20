import React from 'react'
import PropTypes from 'prop-types'
import {latest} from '@mapbox/mapbox-gl-style-spec'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import UrlInput from '../inputs/UrlInput'
import NumberInput from '../inputs/NumberInput'
import SelectInput from '../inputs/SelectInput'
import DynamicArrayInput from '../inputs/DynamicArrayInput'
import ArrayInput from '../inputs/ArrayInput'
import JSONEditor from '../layers/JSONEditor'


class TileJSONSourceEditor extends React.Component {
  static propTypes = {
    source: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
  }

  render() {
    return <div>
      <InputBlock label={"TileJSON URL"} fieldSpec={latest.source_vector.url}>
        <UrlInput
          value={this.props.source.url}
          onChange={url => this.props.onChange({
            ...this.props.source,
            url: url
          })}
        />
      </InputBlock>
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

  changeTileUrl(idx, value) {
    const tiles = this.props.source.tiles.slice(0)
    tiles[idx] = value
    this.props.onChange({
      ...this.props.source,
      tiles: tiles
    })
  }

  renderTileUrls() {
    const prefix = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th']
    const tiles = this.props.source.tiles || []
    return tiles.map((tileUrl, tileIndex) => {
      return <InputBlock key={tileIndex} label={prefix[tileIndex] + " Tile URL"} fieldSpec={latest.source_vector.tiles}>
        <UrlInput
          value={tileUrl}
          onChange={this.changeTileUrl.bind(this, tileIndex)}
        />
      </InputBlock>
    })
  }

  render() {
    return <div>
      {this.renderTileUrls()}
      <InputBlock label={"Min Zoom"} fieldSpec={latest.source_vector.minzoom}>
        <NumberInput
          value={this.props.source.minzoom || 0}
          onChange={minzoom => this.props.onChange({
            ...this.props.source,
            minzoom: minzoom
          })}
        />
      </InputBlock>
      <InputBlock label={"Max Zoom"} fieldSpec={latest.source_vector.maxzoom}>
        <NumberInput
          value={this.props.source.maxzoom || 22}
          onChange={maxzoom => this.props.onChange({
            ...this.props.source,
            maxzoom: maxzoom
          })}
        />
      </InputBlock>
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
      <InputBlock label={"Image URL"} doc={latest.source_image.url.doc}>
        <UrlInput
          value={this.props.source.url}
          onChange={url => this.props.onChange({
            ...this.props.source,
            url,
          })}
        />
      </InputBlock>
      {["top left", "top right", "bottom right", "bottom left"].map((label, idx) => {
        return (
          <InputBlock label={`Coord ${label}`} key={label}>
            <ArrayInput
              length={2}
              type="number"
              value={this.props.source.coordinates[idx]}
              default={[0, 0]}
              onChange={(val) => changeCoord(idx, val)}
            />
          </InputBlock>
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
      <InputBlock label={"Video URL"} doc={latest.source_video.urls.doc}>
        <DynamicArrayInput
          type="string"
          value={this.props.source.urls}
          default={""}
          onChange={changeUrls}
        />
      </InputBlock>
      {["top left", "top right", "bottom right", "bottom left"].map((label, idx) => {
        return (
          <InputBlock label={`Coord ${label}`} key={label}>
            <ArrayInput
              length={2}
              type="number"
              value={this.props.source.coordinates[idx]}
              default={[0, 0]}
              onChange={val => changeCoord(idx, val)}
            />
          </InputBlock>
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
    return <InputBlock label={"GeoJSON URL"} fieldSpec={latest.source_geojson.data}>
      <UrlInput
        value={this.props.source.data}
        onChange={data => this.props.onChange({
          ...this.props.source,
          data: data
        })}
      />
    </InputBlock>
  }
}

class GeoJSONSourceJSONEditor extends React.Component {
  static propTypes = {
    source: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"GeoJSON"} fieldSpec={latest.source_geojson.data}>
      <JSONEditor
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
    </InputBlock>
  }
}

class SourceTypeEditor extends React.Component {
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
      case 'geojson_json': return <GeoJSONSourceJSONEditor {...commonProps} />
      case 'tilejson_vector': return <TileJSONSourceEditor {...commonProps} />
      case 'tilexyz_vector': return <TileURLSourceEditor {...commonProps} />
      case 'tilejson_raster': return <TileJSONSourceEditor {...commonProps} />
      case 'tilexyz_raster': return <TileURLSourceEditor {...commonProps} />
      case 'tilejson_raster-dem': return <TileJSONSourceEditor {...commonProps} />
      case 'tilexyz_raster-dem': return <TileURLSourceEditor {...commonProps}>
        <InputBlock label={"Encoding"} fieldSpec={latest.source_raster_dem.encoding}>
          <SelectInput
            options={Object.keys(latest.source_raster_dem.encoding.values)}
            onChange={encoding => this.props.onChange({
              ...this.props.source,
              encoding: encoding
            })}
            value={this.props.source.encoding || latest.source_raster_dem.encoding.default}
          />
        </InputBlock>
      </TileURLSourceEditor>
      case 'image': return <ImageSourceEditor {...commonProps} />
      case 'video': return <VideoSourceEditor {...commonProps} />
      default: return null
    }
  }
}

export default SourceTypeEditor
