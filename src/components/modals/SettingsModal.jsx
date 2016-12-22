import React from 'react'

import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import Modal from './Modal'
import colors from '../../config/colors'

class SettingsModal extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    onStyleChanged: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    onOpenToggle: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  onChange(property, e) {
    const changedStyle = this.props.mapStyle.set(property, e.target.value)
    this.props.onStyleChanged(changedStyle)
  }

  onRendererChange(renderer) {
    const changedStyle = {
      ...this.props.mapStyle,
      metadata: {
        ...this.props.mapStyle.metadata,
        'maputnik:renderer': renderer,
      }
    }
    this.props.onStyleChanged(changedStyle)
  }

  render() {
    const inputProps = { }
    return <Modal
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'StyleSettings'}
    >
      <InputBlock label={"Name"}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.name}
          onChange={this.onChange.bind(this, "name")}
        />
      </InputBlock>
      <InputBlock label={"Owner"}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.owner}
          onChange={this.onChange.bind(this, "owner")}
        />
      </InputBlock>
      <InputBlock label={"Sprite URL"}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.sprite}
          onChange={this.onChange.bind(this, "sprite")}
        />
      </InputBlock>

      <InputBlock label={"Glyphs URL"}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.glyphs}
          onChange={this.onChange.bind(this, "glyphs")}
        />
      </InputBlock>


      <InputBlock label={"Style Renderer"}>
        <SelectInput {...inputProps}
          options={[
            ['mbgljs', 'MapboxGL JS'],
            ['ol3', 'Open Layers 3']
          ]}
          value={(this.props.mapStyle.metadata || {})['maputnik:renderer'] || 'mbgljs'}
          onChange={this.onRendererChange.bind(this)}
        />
      </InputBlock>
    </Modal>
  }
}

export default SettingsModal
