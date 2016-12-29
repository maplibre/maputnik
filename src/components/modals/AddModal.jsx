import React from 'react'

import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import Modal from './Modal'
import colors from '../../config/colors'

import LayerTypeBlock from '../layers/LayerTypeBlock'
import LayerIdBlock from '../layers/LayerIdBlock'
import LayerSourceBlock from '../layers/LayerSourceBlock'
import LayerSourceLayerBlock from '../layers/LayerSourceLayerBlock'

class AddModal extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    onStyleChanged: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    onOpenToggle: React.PropTypes.func.isRequired,

    // A dict of source id's and the available source layers
    sources: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      type: 'fill',
      id: '',
    }

    if(props.sources.length > 0) {
      this.state.source = Object.keys(this.props.sources)[0]
    }
  }

  componentWillReceiveProps(nextProps) {
    const sourceIds = Object.keys(nextProps.sources)
    if(!this.state.source && sourceIds.length > 0) {
      this.setState({
        source: sourceIds[0],
      })
    }
  }


  render() {
    return <Modal
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Add Layer'}
    >
      <LayerIdBlock
        value={this.state.id}
        onChange={v => this.setState({ id: v })}
      />
      <LayerTypeBlock
        value={this.state.type}
        onChange={v => this.setState({ type: v })}
      />
      <LayerSourceBlock
        sourceIds={Object.keys(this.props.sources)}
        value={this.state.source}
        onChange={v => this.setState({ source: v })}
      />
      <LayerSourceLayerBlock
        sourceLayerIds={this.props.sources[this.state.source] || []}
        value={this.state['source-layer']}
        onChange={v => this.setState({ 'source-layer': v })}
      />
    </Modal>
  }
}

export default AddModal
