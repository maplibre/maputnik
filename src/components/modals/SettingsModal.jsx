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

  changeStyleProperty(property, value) {
    const changedStyle = {
      ...this.props.mapStyle,
      [property]: value
    }
    this.props.onStyleChanged(changedStyle)
  }

  changeMetadataProperty(property, value) {
    const changedStyle = {
      ...this.props.mapStyle,
      metadata: {
        ...this.props.mapStyle.metadata,
        [property]: value
      }
    }
    this.props.onStyleChanged(changedStyle)
  }

  render() {
    const metadata = this.props.mapStyle.metadata || {}
    const inputProps = { }
    return <Modal
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'StyleSettings'}
    >
      <InputBlock label={"Name"}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.name}
          onChange={this.changeStyleProperty.bind(this, "name")}
        />
      </InputBlock>
      <InputBlock label={"Owner"}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.owner}
          onChange={this.changeStyleProperty.bind(this, "owner")}
        />
      </InputBlock>
      <InputBlock label={"Sprite URL"}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.sprite}
          onChange={this.changeStyleProperty.bind(this, "sprite")}
        />
      </InputBlock>

      <InputBlock label={"Glyphs URL"}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.glyphs}
          onChange={this.changeStyleProperty.bind(this, "glyphs")}
        />
      </InputBlock>

      <InputBlock label={"Access Token"}>
        <StringInput {...inputProps}
          value={metadata['maputnik:access_token']}
          onChange={this.changeMetadataProperty.bind(this, "maputnik:access_token")}
        />
      </InputBlock>

      <InputBlock label={"Style Renderer"}>
        <SelectInput {...inputProps}
          options={[
            ['mbgljs', 'MapboxGL JS'],
            ['ol3', 'Open Layers 3'],
          ]}
          value={metadata['maputnik:renderer'] || 'mbgljs'}
          onChange={this.changeMetadataProperty.bind(this, 'maputnik:renderer')}
        />
      </InputBlock>
    </Modal>
  }
}

export default SettingsModal
