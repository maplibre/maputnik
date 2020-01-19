import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@mapbox/mapbox-gl-style-spec'
import InputBlock from '../inputs/InputBlock'
import ArrayInput from '../inputs/ArrayInput'
import NumberInput from '../inputs/NumberInput'
import StringInput from '../inputs/StringInput'
import UrlInput from '../inputs/UrlInput'
import SelectInput from '../inputs/SelectInput'
import EnumInput from '../inputs/EnumInput'
import ColorField from '../fields/ColorField'
import Modal from './Modal'

class SettingsModal extends React.Component {
  static propTypes = {
    mapStyle: PropTypes.object.isRequired,
    onStyleChanged: PropTypes.func.isRequired,
    onChangeMetadataProperty: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
  }

  changeTransitionProperty(property, value) {
    const transition = {
      ...this.props.mapStyle.transition,
    }

    if (value === undefined) {
      delete transition[property];
    }
    else {
      transition[property] = value;
    }

    this.props.onStyleChanged({
      ...this.props.mapStyle,
      transition,
    });
  }

  changeLightProperty(property, value) {
    const light = {
      ...this.props.mapStyle.light,
    }

    if (value === undefined) {
      delete light[property];
    }
    else {
      light[property] = value;
    }

    this.props.onStyleChanged({
      ...this.props.mapStyle,
      light,
    });
  }

  changeStyleProperty(property, value) {
    const changedStyle = {
      ...this.props.mapStyle,
    };

    if (value === undefined) {
      delete changedStyle[property];
    }
    else {
      changedStyle[property] = value;
    }
    this.props.onStyleChanged(changedStyle);
  }

  render() {
    const metadata = this.props.mapStyle.metadata || {}
    const {onChangeMetadataProperty, mapStyle} = this.props;
    const inputProps = { }

    const light = this.props.mapStyle.light || {};
    const transition = this.props.mapStyle.transition || {};

    return <Modal
      data-wd-key="modal-settings"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Style Settings'}
    >
      <div className="modal-settings">
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
        <UrlInput {...inputProps}
          data-wd-key="modal-settings.sprite" 
          value={this.props.mapStyle.sprite}
          onChange={this.changeStyleProperty.bind(this, "sprite")}
        />
      </InputBlock>

      <InputBlock label={"Glyphs URL"} doc={latest.$root.glyphs.doc}>
        <UrlInput {...inputProps}
          data-wd-key="modal-settings.glyphs" 
          value={this.props.mapStyle.glyphs}
          onChange={this.changeStyleProperty.bind(this, "glyphs")}
        />
      </InputBlock>

      <InputBlock label={"Mapbox Access Token"} doc={"Public access token for Mapbox services."}>
        <StringInput {...inputProps}
          data-wd-key="modal-settings.maputnik:mapbox_access_token" 
          value={metadata['maputnik:mapbox_access_token']}
          onChange={onChangeMetadataProperty.bind(this, "maputnik:mapbox_access_token")}
        />
      </InputBlock>

      <InputBlock label={"MapTiler Access Token"} doc={"Public access token for MapTiler Cloud."}>
        <StringInput {...inputProps}
          data-wd-key="modal-settings.maputnik:openmaptiles_access_token" 
          value={metadata['maputnik:openmaptiles_access_token']}
          onChange={onChangeMetadataProperty.bind(this, "maputnik:openmaptiles_access_token")}
        />
      </InputBlock>

      <InputBlock label={"Thunderforest Access Token"} doc={"Public access token for Thunderforest services."}>
        <StringInput {...inputProps}
          data-wd-key="modal-settings.maputnik:thunderforest_access_token" 
          value={metadata['maputnik:thunderforest_access_token']}
          onChange={onChangeMetadataProperty.bind(this, "maputnik:thunderforest_access_token")}
        />
      </InputBlock>

      <InputBlock label={"Center"} doc={latest.$root.center.doc}>
        <ArrayInput
          length={2}
          type="number"
          value={mapStyle.center}
          default={latest.$root.center.default || [0, 0]}
          onChange={this.changeStyleProperty.bind(this, "center")}
        />
      </InputBlock>

      <InputBlock label={"Zoom"} doc={latest.$root.zoom.doc}>
        <NumberInput
          {...inputProps}
          value={mapStyle.zoom}
          default={latest.$root.zoom.default || 0}
          onChange={this.changeStyleProperty.bind(this, "zoom")}
        />
      </InputBlock>

      <InputBlock label={"Bearing"} doc={latest.$root.bearing.doc}>
        <NumberInput
          {...inputProps}
          value={mapStyle.bearing}
          default={latest.$root.bearing.default}
          onChange={this.changeStyleProperty.bind(this, "bearing")}
        />
      </InputBlock>

      <InputBlock label={"Pitch"} doc={latest.$root.pitch.doc}>
        <NumberInput
          {...inputProps}
          value={mapStyle.pitch}
          default={latest.$root.pitch.default}
          onChange={this.changeStyleProperty.bind(this, "pitch")}
        />
      </InputBlock>

      <InputBlock label={"Light anchor"} doc={latest.light.anchor.doc}>
        <EnumInput
          {...inputProps}
          value={light.anchor}
          options={Object.keys(latest.light.anchor.values)}
          default={latest.light.anchor.default}
          onChange={this.changeLightProperty.bind(this, "anchor")}
        />
      </InputBlock>

      <InputBlock label={"Light color"} doc={latest.light.color.doc}>
        <ColorField
          {...inputProps}
          value={light.color}
          default={latest.light.color.default}
          onChange={this.changeLightProperty.bind(this, "color")}
        />
      </InputBlock>

      <InputBlock label={"Light intensity"} doc={latest.light.intensity.doc}>
        <NumberInput
          {...inputProps}
          value={light.intensity}
          default={latest.light.intensity.default}
          onChange={this.changeLightProperty.bind(this, "intensity")}
        />
      </InputBlock>

      <InputBlock label={"Light position"} doc={latest.light.position.doc}>
        <ArrayInput
          {...inputProps}
          type="number"
          length={latest.light.position.length}
          value={light.position}
          default={latest.light.position.default}
          onChange={this.changeLightProperty.bind(this, "position")}
        />
      </InputBlock>

      <InputBlock label={"Transition delay"} doc={latest.transition.delay.doc}>
        <NumberInput
          {...inputProps}
          value={transition.delay}
          default={latest.transition.delay.default}
          onChange={this.changeTransitionProperty.bind(this, "delay")}
        />
      </InputBlock>

      <InputBlock label={"Transition duration"} doc={latest.transition.duration.doc}>
        <NumberInput
          {...inputProps}
          value={transition.duration}
          default={latest.transition.duration.default}
          onChange={this.changeTransitionProperty.bind(this, "duration")}
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
          onChange={onChangeMetadataProperty.bind(this, 'maputnik:renderer')}
        />
      </InputBlock>



      </div>
    </Modal>
  }
}

export default SettingsModal
