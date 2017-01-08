import React from 'react'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import NumberInput from '../inputs/NumberInput'

class TileJSONSourceEditor extends React.Component {
  static propTypes = {
    source: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func,
  }

  render() {
    return <InputBlock label={"TileJSON URL"}>
      <StringInput
        value={this.props.source.url}
        onChange={url => this.props.onChange({
          ...this.props.source,
          url: url
        })}
      />
    </InputBlock>
  }
}

class TileURLSourceEditor extends React.Component {
  static propTypes = {
    source: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func,
  }

  renderTileUrls() {
    const prefix = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th']
    const tiles = this.props.source.tiles || []
    return tiles.map((tileUrl, tileIndex) => {
      return <InputBlock key={tileIndex} label={prefix[tileIndex] + " Tile URL"}>
        <StringInput
          value={tileUrl}
        />
      </InputBlock>
    })
  }

  render() {
    return <div>
      {this.renderTileUrls()}
      <InputBlock label={"Min Zoom"}>
        <NumberInput
          value={this.props.source.minZoom}
          onChange={minZoom => this.props.onChange({
            ...this.props.source,
            minZoom: minZoom
          })}
        />
      </InputBlock>
      <InputBlock label={"Max Zoom"}>
        <NumberInput
          value={this.props.source.maxZoom}
          onChange={maxZoom => this.props.onChange({
            ...this.props.source,
            maxZoom: maxZoom
          })}
        />
      </InputBlock>
  </div>

  }
}

class GeoJSONSourceEditor extends React.Component {
  static propTypes = {
    source: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func,
  }

  render() {
    return <InputBlock label={"GeoJSON Data"}>
      <StringInput
        value={this.props.source.data}
        onChange={data => this.props.onChange({
          ...this.props.source,
          data: data
        })}
      />
    </InputBlock>
  }
}

class SourceTypeEditor extends React.Component {
  static propTypes = {
    mode: React.PropTypes.string.isRequired,
    source: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    const commonProps = {
      source: this.props.source,
      onChange: this.props.onChange,
    }
    switch(this.props.mode) {
      case 'geojson': return <GeoJSONSourceEditor {...commonProps} />
      case 'tilejson_vector': return <TileJSONSourceEditor {...commonProps} />
      case 'tilexyz_vector': return <TileURLSourceEditor {...commonProps} />
      case 'tilejson_raster': return <TileJSONSourceEditor {...commonProps} />
      case 'tilexyz_raster': return <TileURLSourceEditor {...commonProps} />
      default: return null
    }
  }
}

export default SourceTypeEditor
