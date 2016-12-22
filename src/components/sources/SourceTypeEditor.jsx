import React from 'react'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'

class TileJSONSourceEditor extends React.Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
  }

  render() {
    return <InputBlock label={"TileJSON URL"}>
      <StringInput
        value={this.props.url}
        onChange={this.props.onChange}
      />
    </InputBlock>
  }
}

class TileURLSourceEditor extends React.Component {
  static propTypes = {
    tiles: React.PropTypes.array.isRequired,
    minZoom: React.PropTypes.number.isRequired,
    maxZoom: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func,
  }

  renderTileUrls() {
    const prefix = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th']
    return this.props.tiles.map((tileUrl, tileIndex) => {
      return <InputBlock key={tileIndex} label={prefix[tileIndex] + " Tile URL"}>
        <StringInput
          value={tileUrl}
        />
      </InputBlock>
    })
  }

  render() {
    console.log(this.props.tiles)
    return <div>
      {this.renderTileUrls()}
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
    onChange: React.PropTypes.func,
  }

  render() {
    return <InputBlock label={"GeoJSON Data"}>
      <StringInput
        value={this.props.data}
        onChange={this.props.onChange}
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
    const source = this.props.source
    switch(this.props.mode) {
      case 'geojson': return <GeoJSONSourceEditor data={source.data || 'http://localhost:3000/mygeojson.json'} />
      case 'tilejson': return <TileJSONSourceEditor url={source.url || 'http://localhost:3000/tiles.json'}/>
      case 'tilexyz': return <TileURLSourceEditor tiles={source.tiles || ['http://localhost:3000/{x}/{y}/{z}.pbf']} minZoom={source.minZoom || 0} maxZoom={source.maxZoom || 14}/>
      default: return null
    }
  }
}

export default SourceTypeEditor
