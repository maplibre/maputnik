import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@mapbox/mapbox-gl-style-spec'
import Block from './Block'
import FieldArray from './FieldArray'
import FieldNumber from './FieldNumber'
import FieldString from './FieldString'
import FieldUrl from './FieldUrl'
import FieldSelect from './FieldSelect'
import FieldEnum from './FieldEnum'
import FieldColor from './FieldColor'
import Modal from './Modal'
import fieldSpecAdditional from '../libs/field-spec-additional'

export default class ModalSettings extends React.Component {
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
      data-wd-key="modal:settings"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Style Settings'}
    >
      <div className="modal:settings">
      <Block label={"Name"} fieldSpec={latest.$root.name}>
        <FieldString {...inputProps}
          data-wd-key="modal:settings.name" 
          value={this.props.mapStyle.name}
          onChange={this.changeStyleProperty.bind(this, "name")}
        />
      </Block>
      <Block label={"Owner"} fieldSpec={{doc: "Owner ID of the style. Used by Mapbox or future style APIs."}}>
        <FieldString {...inputProps}
          data-wd-key="modal:settings.owner" 
          value={this.props.mapStyle.owner}
          onChange={this.changeStyleProperty.bind(this, "owner")}
        />
      </Block>
      <Block label={"Sprite URL"} fieldSpec={latest.$root.sprite}>
        <FieldUrl {...inputProps}
          data-wd-key="modal:settings.sprite" 
          value={this.props.mapStyle.sprite}
          onChange={this.changeStyleProperty.bind(this, "sprite")}
        />
      </Block>

      <Block label={"Glyphs URL"} fieldSpec={latest.$root.glyphs}>
        <FieldUrl {...inputProps}
          data-wd-key="modal:settings.glyphs" 
          value={this.props.mapStyle.glyphs}
          onChange={this.changeStyleProperty.bind(this, "glyphs")}
        />
      </Block>

      <Block
        label={fieldSpecAdditional.maputnik.mapbox_access_token.label} 
        fieldSpec={fieldSpecAdditional.maputnik.mapbox_access_token}
      >
        <FieldString {...inputProps}
          data-wd-key="modal:settings.maputnik:mapbox_access_token" 
          value={metadata['maputnik:mapbox_access_token']}
          onChange={onChangeMetadataProperty.bind(this, "maputnik:mapbox_access_token")}
        />
      </Block>

      <Block
        label={fieldSpecAdditional.maputnik.maptiler_access_token.label} 
        fieldSpec={fieldSpecAdditional.maputnik.maptiler_access_token}
      >
        <FieldString {...inputProps}
          data-wd-key="modal:settings.maputnik:openmaptiles_access_token" 
          value={metadata['maputnik:openmaptiles_access_token']}
          onChange={onChangeMetadataProperty.bind(this, "maputnik:openmaptiles_access_token")}
        />
      </Block>

      <Block
        label={fieldSpecAdditional.maputnik.thunderforest_access_token.label} 
        fieldSpec={fieldSpecAdditional.maputnik.thunderforest_access_token}
      >
        <FieldString {...inputProps}
          data-wd-key="modal:settings.maputnik:thunderforest_access_token" 
          value={metadata['maputnik:thunderforest_access_token']}
          onChange={onChangeMetadataProperty.bind(this, "maputnik:thunderforest_access_token")}
        />
      </Block>

      <Block label={"Center"} fieldSpec={latest.$root.center}>
        <FieldArray
          length={2}
          type="number"
          value={mapStyle.center}
          default={latest.$root.center.default || [0, 0]}
          onChange={this.changeStyleProperty.bind(this, "center")}
        />
      </Block>

      <Block label={"Zoom"} fieldSpec={latest.$root.zoom}>
        <FieldNumber
          {...inputProps}
          value={mapStyle.zoom}
          default={latest.$root.zoom.default || 0}
          onChange={this.changeStyleProperty.bind(this, "zoom")}
        />
      </Block>

      <Block label={"Bearing"} fieldSpec={latest.$root.bearing}>
        <FieldNumber
          {...inputProps}
          value={mapStyle.bearing}
          default={latest.$root.bearing.default}
          onChange={this.changeStyleProperty.bind(this, "bearing")}
        />
      </Block>

      <Block label={"Pitch"} fieldSpec={latest.$root.pitch}>
        <FieldNumber
          {...inputProps}
          value={mapStyle.pitch}
          default={latest.$root.pitch.default}
          onChange={this.changeStyleProperty.bind(this, "pitch")}
        />
      </Block>

      <Block label={"Light anchor"} fieldSpec={latest.light.anchor}>
        <FieldEnum
          {...inputProps}
          name="light-anchor"
          value={light.anchor}
          options={Object.keys(latest.light.anchor.values)}
          default={latest.light.anchor.default}
          onChange={this.changeLightProperty.bind(this, "anchor")}
        />
      </Block>

      <Block label={"Light color"} fieldSpec={latest.light.color}>
        <FieldColor
          {...inputProps}
          value={light.color}
          default={latest.light.color.default}
          onChange={this.changeLightProperty.bind(this, "color")}
        />
      </Block>

      <Block label={"Light intensity"} fieldSpec={latest.light.intensity}>
        <FieldNumber
          {...inputProps}
          value={light.intensity}
          default={latest.light.intensity.default}
          onChange={this.changeLightProperty.bind(this, "intensity")}
        />
      </Block>

      <Block label={"Light position"} fieldSpec={latest.light.position}>
        <FieldArray
          {...inputProps}
          type="number"
          length={latest.light.position.length}
          value={light.position}
          default={latest.light.position.default}
          onChange={this.changeLightProperty.bind(this, "position")}
        />
      </Block>

      <Block label={"Transition delay"} fieldSpec={latest.transition.delay}>
        <FieldNumber
          {...inputProps}
          value={transition.delay}
          default={latest.transition.delay.default}
          onChange={this.changeTransitionProperty.bind(this, "delay")}
        />
      </Block>

      <Block label={"Transition duration"} fieldSpec={latest.transition.duration}>
        <FieldNumber
          {...inputProps}
          value={transition.duration}
          default={latest.transition.duration.default}
          onChange={this.changeTransitionProperty.bind(this, "duration")}
        />
      </Block>

      <Block
        label={fieldSpecAdditional.maputnik.style_renderer.label}
        fieldSpec={fieldSpecAdditional.maputnik.style_renderer}
      >
        <FieldSelect {...inputProps}
          data-wd-key="modal:settings.maputnik:renderer" 
          options={[
            ['mbgljs', 'MapboxGL JS'],
            ['ol', 'Open Layers (experimental)'],
          ]}
          value={metadata['maputnik:renderer'] || 'mbgljs'}
          onChange={onChangeMetadataProperty.bind(this, 'maputnik:renderer')}
        />
      </Block>



      </div>
    </Modal>
  }
}

