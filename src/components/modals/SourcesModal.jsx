import React from 'react'
import Modal from './Modal'
import Heading from '../Heading'
import Button from '../Button'
import Paragraph from '../Paragraph'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import SourceTypeEditor from '../sources/SourceTypeEditor'

import publicSources from '../../config/tilesets.json'
import colors from '../../config/colors'
import { margins, fontSizes } from '../../config/scales'

import AddIcon from 'react-icons/lib/md/add-circle-outline'
import DeleteIcon from 'react-icons/lib/md/delete'

class PublicSource extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired,
  }

  render() {
    return <div style={{
        verticalAlign: 'top',
        marginTop: margins[2],
        marginRight: margins[2],
        backgroundColor: colors.gray,
        display: 'inline-block',
        width: 240,
        fontSize: fontSizes[4],
        color: colors.lowgray,
    }}>
      <Button style={{
        backgroundColor: 'transparent',
        padding: margins[2],
        display: 'flex',
        flexDirection: 'row',
      }}>
        <div>
          <span style={{fontWeight: 700}}>{this.props.title}</span>
          <br/>
          <span style={{fontSize: fontSizes[5]}}>#{this.props.id}</span>
        </div>
        <span style={{flexGrow: 1}} />
        <AddIcon />
      </Button>
    </div>
  }
}

function editorMode(source) {
  if(source.type === 'geojson') return ' geojson'
  if(source.type === 'vector' && source.tiles) {
    return 'tilexyz'
  }
  return 'tilejson'
}

class SourceEditorLayout extends React.Component {
  static propTypes = {
    sourceId: React.PropTypes.string.isRequired,
    source: React.PropTypes.object.isRequired,
    onSourceDelete: React.PropTypes.func.isRequired,
    onSourceChange: React.PropTypes.func.isRequired,
  }

  render() {
    const inputProps = { }
    return <div style={{
    }}>
      <div style={{
        backgroundColor: colors.gray,
        color: colors.lowgray,
        padding: margins[1],
        display: 'flex',
        fontSize: fontSizes[4],
        flexDirection: 'row',
      }}>
        <span style={{fontWeight: 700, fontSize: fontSizes[4], lineHeight: 2}}>#{this.props.sourceId}</span>
        <span style={{flexGrow: 1}} />
        <Button
          onClick={this.props.onSourceDelete}
          style={{backgroundColor: 'transparent'}}
        >
          <DeleteIcon />
        </Button>
      </div>
      <div style={{
        borderColor: colors.gray,
        borderWidth: 2,
        borderStyle: 'solid',
        padding: margins[1],
      }}>
        <SourceTypeEditor
          onChange={this.props.onSourceChange}
          mode={editorMode(this.props.source)}
          source={this.props.source}
        />
      </div>
    </div>
  }
}

class AddSource extends React.Component {
  static propTypes = {
    onSourceAdd: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      mode: 'tilejson',
      source: {}
    }
  }

  onSourceChange(source) {
    this.setState({
      source: source
    })
  }

  render() {
    return <div>
      <InputBlock label={"Source ID"}>
        <StringInput
          value={'blubid'}
        />
      </InputBlock>
      <InputBlock label={"Source Type"}>
        <SelectInput
          options={[
            ['geojson', 'GeoJSON'],
            ['tilejson', 'Vector (TileJSON URL)'],
            ['tilexyz', 'Vector (XYZ URLs)'],
          ]}
          onChange={v => this.setState({mode: v})}
          value={this.state.mode}
        />
      </InputBlock>
      <SourceTypeEditor
        onChange={this.onSourceChange.bind(this)}
        mode={this.state.mode}
        source={this.state.source}
      />
      <Button onClick={() => this.props.onSourceAdd(this.state.source)}>
        Add Source
      </Button>
    </div>
  }
}

class SourcesModal extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    toggle: React.PropTypes.func.isRequired,
  }

  render() {
    const activeSources = Object.keys(this.props.mapStyle.sources).map(sourceId => {
      const source = this.props.mapStyle.sources[sourceId]
      return <SourceEditorLayout sourceId={sourceId} source={source} />
    })

    const tilesetOptions = publicSources.filter(tileset => !(tileset.id in this.props.mapStyle.sources)).map(tileset => {
      return <PublicSource
        id={tileset.id}
        type={tileset.type}
        title={tileset.title}
        description={tileset.description}
      />
    })

    const inputProps = { }
    return <Modal
      isOpen={this.props.isOpen}
      toggleOpen={this.props.toggle}
      title={'Sources'}
    >
      <Heading level={4}>Active Sources</Heading>
      {activeSources}

      <Heading level={4}>Add New Source</Heading>
      <div style={{maxWidth: 300}}>
        <p style={{color: colors.lowgray, fontSize: fontSizes[5]}}>Add a new source to your style. You can only choose the source type and id at creation time!</p>
        <AddSource />
      </div>

      <Heading level={4}>Choose Public Source</Heading>
      <Paragraph>
        Add one of the publicly availble sources to your style.
      </Paragraph>
      <div style={{maxwidth: 500}}>
      {tilesetOptions}
      </div>
    </Modal>
  }
}

export default SourcesModal
