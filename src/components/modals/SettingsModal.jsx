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
import fieldSpecAdditional from '../../libs/field-spec-additional'

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
      <InputBlock label={"Name"} fieldSpec={latest.$root.name}>
        <StringInput {...inputProps}
          data-wd-key="modal-settings.name" 
          value={this.props.mapStyle.name}
          onChange={this.changeStyleProperty.bind(this, "name")}
        />
      </InputBlock>
      <InputBlock label={"Owner"} fieldSpec={{doc: "Owner ID of the style. Used by Mapbox or future style APIs."}}>
        <StringInput {...inputProps}
          data-wd-key="modal-settings.owner" 
          value={this.props.mapStyle.owner}
          onChange={this.changeStyleProperty.bind(this, "owner")}
        />
      </InputBlock>
      <InputBlock label={"Sprite URL"} fieldSpec={latest.$root.sprite}>
        <UrlInput {...inputProps}
          data-wd-key="modal-settings.sprite" 
          value={this.props.mapStyle.sprite}
          onChange={this.changeStyleProperty.bind(this, "sprite")}
        />
      </InputBlock>

      <InputBlock label={"Glyphs URL"} fieldSpec={latest.$root.glyphs}>
        <UrlInput {...inputProps}
          data-wd-key="modal-settings.glyphs" 
          value={this.props.mapStyle.glyphs}
          onChange={this.changeStyleProperty.bind(this, "glyphs")}
        />
      </InputBlock>

      <InputBlock
        label={fieldSpecAdditional.maputnik.mapbox_access_token.label} 
        fieldSpec={fieldSpecAdditional.maputnik.mapbox_access_token}
      >
        <StringInput {...inputProps}
          data-wd-key="modal-settings.maputnik:mapbox_access_token" 
          value={metadata['maputnik:mapbox_access_token']}
          onChange={onChangeMetadataProperty.bind(this, "maputnik:mapbox_access_token")}
        />
      </InputBlock>

      <InputBlock
        label={fieldSpecAdditional.maputnik.maptiler_access_token.label} 
        fieldSpec={fieldSpecAdditional.maputnik.maptiler_access_token}
      >
        <StringInput {...inputProps}
          data-wd-key="modal-settings.maputnik:openmaptiles_access_token" 
          value={metadata['maputnik:openmaptiles_access_token']}
          onChange={onChangeMetadataProperty.bind(this, "maputnik:openmaptiles_access_token")}
        />
      </InputBlock>

      <InputBlock
        label={fieldSpecAdditional.maputnik.thunderforest_access_token.label} 
        fieldSpec={fieldSpecAdditional.maputnik.thunderforest_access_token}
      >
        <StringInput {...inputProps}
          data-wd-key="modal-settings.maputnik:thunderforest_access_token" 
          value={metadata['maputnik:thunderforest_access_token']}
          onChange={onChangeMetadataProperty.bind(this, "maputnik:thunderforest_access_token")}
        />
      </InputBlock>

      <InputBlock label={"Center"} fieldSpec={latest.$root.center}>
        <ArrayInput
          length={2}
          type="number"
          value={mapStyle.center}
          default={latest.$root.center.default || [0, 0]}
          onChange={this.changeStyleProperty.bind(this, "center")}
        />
      </InputBlock>

      <InputBlock label={"Zoom"} fieldSpec={latest.$root.zoom}>
        <NumberInput
          {...inputProps}
          value={mapStyle.zoom}
          default={latest.$root.zoom.default || 0}
          onChange={this.changeStyleProperty.bind(this, "zoom")}
        />
      </InputBlock>

      <InputBlock label={"Bearing"} fieldSpec={latest.$root.bearing}>
        <NumberInput
          {...inputProps}
          value={mapStyle.bearing}
          default={latest.$root.bearing.default}
          onChange={this.changeStyleProperty.bind(this, "bearing")}
        />
      </InputBlock>

      <InputBlock label={"Pitch"} fieldSpec={latest.$root.pitch}>
        <NumberInput
          {...inputProps}
          value={mapStyle.pitch}
          default={latest.$root.pitch.default}
          onChange={this.changeStyleProperty.bind(this, "pitch")}
        />
      </InputBlock>

      <InputBlock label={"Light anchor"} fieldSpec={latest.light.anchor}>
        <EnumInput
          {...inputProps}
          value={light.anchor}
          options={Object.keys(latest.light.anchor.values)}
          default={latest.light.anchor.default}
          onChange={this.changeLightProperty.bind(this, "anchor")}
        />
      </InputBlock>

      <InputBlock label={"Light color"} fieldSpec={latest.light.color}>
        <ColorField
          {...inputProps}
          value={light.color}
          default={latest.light.color.default}
          onChange={this.changeLightProperty.bind(this, "color")}
        />
      </InputBlock>

      <InputBlock label={"Light intensity"} fieldSpec={latest.light.intensity}>
        <NumberInput
          {...inputProps}
          value={light.intensity}
          default={latest.light.intensity.default}
          onChange={this.changeLightProperty.bind(this, "intensity")}
        />
      </InputBlock>

      <InputBlock label={"Light position"} fieldSpec={latest.light.position}>
        <ArrayInput
          {...inputProps}
          type="number"
          length={latest.light.position.length}
          value={light.position}
          default={latest.light.position.default}
          onChange={this.changeLightProperty.bind(this, "position")}
        />
      </InputBlock>

      <InputBlock label={"Transition delay"} fieldSpec={latest.transition.delay}>
        <NumberInput
          {...inputProps}
          value={transition.delay}
          default={latest.transition.delay.default}
          onChange={this.changeTransitionProperty.bind(this, "delay")}
        />
      </InputBlock>

      <InputBlock label={"Transition duration"} fieldSpec={latest.transition.duration}>
        <NumberInput
          {...inputProps}
          value={transition.duration}
          default={latest.transition.duration.default}
          onChange={this.changeTransitionProperty.bind(this, "duration")}
        />
      </InputBlock>

      <InputBlock
        label={fieldSpecAdditional.maputnik.style_renderer.label}
        fieldSpec={fieldSpecAdditional.maputnik.style_renderer}
      >
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
