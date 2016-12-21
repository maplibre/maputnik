import React from 'react'
import Modal from './Modal'
import Heading from '../Heading'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import publicSources from '../../config/tilesets.json'
import colors from '../../config/colors'
import { margins } from '../../config/scales'

class PublicSource extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired,
  }

  render() {
    return <div style={{
        verticalAlign: 'top',
        marginTop: margins[2],
        marginRight: margins[2],
        borderColor: colors.midgray,
        borderStyle: 'solid',
        borderWidth: 2,
        display: 'inline-block',
        width: 240,
        height: 120,
    }}>
      <div style={{
        backgroundColor: colors.midgray,
        padding: margins[1],
        display: 'flex',
        flexDirection: 'row',
      }}>
        <span>{this.props.title}</span>
        <span style={{flexGrow: 1}} />
        <span>#{this.props.id}</span>
      </div>
      <div style={{
        padding: margins[1],
      }}>
        <p>{this.props.description}</p>
      </div>
    </div>
  }
}

class SourceEditor extends React.Component {
  static propTypes = {
    sourceId: React.PropTypes.string.isRequired,
    source: React.PropTypes.object.isRequired,
  }

  render() {
    const inputProps = {
      style: {
        backgroundColor: colors.midgray
      }
    }
    return <div style={{
    }}>
      <InputBlock label={"Source ID"}>
        <StringInput {...inputProps}
          value={this.props.sourceId}
        />
      </InputBlock>
      <InputBlock label={"Source URL"}>
        <StringInput {...inputProps}
          value={this.props.source.url}
        />
      </InputBlock>
      <InputBlock label={"Source Type"}>
        <StringInput {...inputProps}
          value={this.props.source.type}
        />
      </InputBlock>
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
      return <SourceEditor sourceId={sourceId} source={source} />
    })

    const tilesetOptions = publicSources.map(tileset => {
      return <PublicSource
        id={tileset.id}
        type={tileset.type}
        title={tileset.title}
        description={tileset.description}
      />
    })

    const inputProps = {
      style: {
        backgroundColor: colors.midgray
      }
    }

    return <Modal
      isOpen={this.props.isOpen}
      toggleOpen={this.props.toggle}
      title={'Sources'}
    >
      <Heading level={4}>Active Sources</Heading>
      {activeSources}

      <Heading level={4}>Add New Source</Heading>
      <InputBlock label={"TileJSON URL"}>
        <StringInput {...inputProps} />
      </InputBlock>
      <Heading level={4}>Choose Public Source</Heading>
      <div style={{maxwidth: 500}}>
      {tilesetOptions}
      </div>
    </Modal>
  }
}

export default SourcesModal
