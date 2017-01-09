import React from 'react'

import GlSpec from 'mapbox-gl-style-spec/reference/latest.js'
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
      title={'Style Settings'}
    >
      <InputBlock label={"Name"} doc={GlSpec['$root'].name.doc}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.name}
          onChange={this.changeStyleProperty.bind(this, "name")}
        />
      </InputBlock>
      <InputBlock label={"Owner"} doc={"Owner ID of the style. Used by Mapbox or future style APIs."}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.owner}
          onChange={this.changeStyleProperty.bind(this, "owner")}
        />
      </InputBlock>
      <InputBlock label={"Sprite URL"} doc={GlSpec['$root'].sprite.doc}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.sprite}
          onChange={this.changeStyleProperty.bind(this, "sprite")}
        />
      </InputBlock>

      <InputBlock label={"Glyphs URL"} doc={GlSpec['$root'].glyphs.doc}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.glyphs}
          onChange={this.changeStyleProperty.bind(this, "glyphs")}
        />
      </InputBlock>

      <InputBlock label={"Access Token"} doc={"Public access token for Mapbox GL."}>
        <StringInput {...inputProps}
          value={metadata['maputnik:access_token']}
          onChange={this.changeMetadataProperty.bind(this, "maputnik:access_token")}
        />
      </InputBlock>

      <InputBlock label={"Style Renderer"} doc={"Choose the default Maputnik renderer for this style."}>
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
