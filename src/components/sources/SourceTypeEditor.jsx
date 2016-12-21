import React from 'react'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'

class TileJSONSourceEditor extends React.Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
  }

  render() {
    return <InputBlock label={"TileJSON URL"}>
      <StringInput
        value={this.props.url}
      />
    </InputBlock>
  }
}

class TileURLSourceEditor extends React.Component {
  static propTypes = {
    tiles: React.PropTypes.array.isRequired,
    minZoom: React.PropTypes.number.isRequired,
    maxZoom: React.PropTypes.number.isRequired,
  }

  renderTileUrls() {
    return this.props.tiles.map((tileUrl, tileIndex) => {
      <InputBlock key={tileIndex} label={"Tile URL " + tileIndex}>
        <StringInput
          value={this.props.data}
        />
      </InputBlock>
    })
  }

  render() {
    return <div>
      {this.renderTileUrls()}
      <InputBlock label={"GeoJSON Data"}>
        <StringInput
          value={this.props.data}
        />
      </InputBlock>
      <InputBlock label={"Min Zoom"}>
        <StringInput
          value={this.props.minZoom}
        />
      </InputBlock>
      <InputBlock label={"Max Zoom"}>
        <StringInput
          value={this.props.maxZoom}
        />
      </InputBlock>
  </div>

  }
}

class GeoJSONSourceEditor extends React.Component {
  static propTypes = {
    data: React.PropTypes.string.isRequired,
  }

  render() {
    return <InputBlock label={"GeoJSON Data"}>
      <StringInput
        value={this.props.data}
      />
    </InputBlock>
  }
}

class SourceTypeEditor extends React.Component {
  static propTypes = {
    source: React.PropTypes.object.isRequired,
  }

  render() {
    const source = this.props.source
    if(source.type === "geojson") {
      return <GeoJSONSourceEditor data={source.data} />
    }
    if(source.type === "vector") {
      if(source.url) {
        return <TileJSONSourceEditor url={source.url}/>
      } else {
        return <TileURLSourceEditor tiles={source.tiles} minZoom={source.minZoom} maxZoom={source.maxZoom}/>
      }
    }
    return null
  }
}

export default SourceTypeEditor
