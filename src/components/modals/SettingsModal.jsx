import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@mapbox/mapbox-gl-style-spec'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import Modal from './Modal'

class SettingsModal extends React.Component {
  static propTypes = {
    mapStyle: PropTypes.object.isRequired,
    onStyleChanged: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
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
      data-wd-key="modal-settings"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Style Settings'}
    >
      <div style={{minWidth: 350}}>
      <InputBlock label={"Name"} doc={latest.$root.name.doc}>
        <StringInput {...inputProps}
          data-wd-key="modal-settings.name" 
          value={this.props.mapStyle.name}
          onChange={this.changeStyleProperty.bind(this, "name")}
        />
      </InputBlock>
      <InputBlock label={"Owner"} doc={"Owner ID of the style. Used by Mapbox or future style APIs."}>
        <StringInput {...inputProps}
          data-wd-key="modal-settings.owner" 
          value={this.props.mapStyle.owner}
          onChange={this.changeStyleProperty.bind(this, "owner")}
        />
      </InputBlock>
      <InputBlock label={"Sprite URL"} doc={latest.$root.sprite.doc}>
        <StringInput {...inputProps}
          data-wd-key="modal-settings.sprite" 
          value={this.props.mapStyle.sprite}
          onChange={this.changeStyleProperty.bind(this, "sprite")}
        />
      </InputBlock>

      <InputBlock label={"Glyphs URL"} doc={latest.$root.glyphs.doc}>
        <StringInput {...inputProps}
          data-wd-key="modal-settings.glyphs" 
          value={this.props.mapStyle.glyphs}
          onChange={this.changeStyleProperty.bind(this, "glyphs")}
        />
      </InputBlock>

      <InputBlock label={"Mapbox Access Token"} doc={"Public access token for Mapbox services."}>
        <StringInput {...inputProps}
          data-wd-key="modal-settings.maputnik:mapbox_access_token" 
          value={metadata['maputnik:mapbox_access_token']}
          onChange={this.changeMetadataProperty.bind(this, "maputnik:mapbox_access_token")}
        />
      </InputBlock>

      <InputBlock label={"MapTiler Access Token"} doc={"Public access token for MapTiler Cloud."}>
        <StringInput {...inputProps}
          data-wd-key="modal-settings.maputnik:openmaptiles_access_token" 
          value={metadata['maputnik:openmaptiles_access_token']}
          onChange={this.changeMetadataProperty.bind(this, "maputnik:openmaptiles_access_token")}
        />
      </InputBlock>

      <InputBlock label={"Thunderforest Access Token"} doc={"Public access token for Thunderforest services."}>
        <StringInput {...inputProps}
          data-wd-key="modal-settings.maputnik:thunderforest_access_token" 
          value={metadata['maputnik:thunderforest_access_token']}
          onChange={this.changeMetadataProperty.bind(this, "maputnik:thunderforest_access_token")}
        />
      </InputBlock>

      <InputBlock label={"Style Renderer"} doc={"Choose the default Maputnik renderer for this style."}>
        <SelectInput {...inputProps}
          data-wd-key="modal-settings.maputnik:renderer" 
          options={[
            ['mbgljs', 'MapboxGL JS'],
            ['ol', 'Open Layers (experimental)'],
          ]}
          value={metadata['maputnik:renderer'] || 'mbgljs'}
          onChange={this.changeMetadataProperty.bind(this, 'maputnik:renderer')}
        />
      </InputBlock>
      </div>
    </Modal>
  }
}

export default SettingsModal
