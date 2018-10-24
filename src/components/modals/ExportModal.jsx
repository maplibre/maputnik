import React from 'react'
import PropTypes from 'prop-types'
import Slugify from 'slugify'
import { saveAs } from 'file-saver'

import {format} from '@mapbox/mapbox-gl-style-spec'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import CheckboxInput from '../inputs/CheckboxInput'
import Button from '../Button'
import Modal from './Modal'
import {MdFileDownload} from 'react-icons/md'
import style from '../../libs/style'



function stripAccessTokens(mapStyle) {
  const changedMetadata = { ...mapStyle.metadata }
  delete changedMetadata['maputnik:mapbox_access_token']
  delete changedMetadata['maputnik:openmaptiles_access_token']
  return {
    ...mapStyle,
    metadata: changedMetadata
  }
}

class ExportModal extends React.Component {
  static propTypes = {
    mapStyle: PropTypes.object.isRequired,
    onStyleChanged: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  downloadStyle() {
    const tokenStyle = format(stripAccessTokens(style.replaceAccessTokens(this.props.mapStyle)));

    const blob = new Blob([tokenStyle], {type: "application/json;charset=utf-8"});
    let exportName;
    if(this.props.mapStyle.name) {
      exportName = Slugify(this.props.mapStyle.name, {
                     replacement: '_',
                     lower: true
                   })
    } else {
      exportName = this.props.mapStyle.id
    }
    saveAs(blob, exportName + ".json");
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
    return <Modal
      data-wd-key="export-modal"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Export Style'}
    >

      <div className="maputnik-modal-section">
        <h4>Download Style</h4>
        <p>
          Download a JSON style to your computer.
        </p>

        <p>
          <InputBlock label={"MapTiler Access Token: "}>
            <StringInput
              value={(this.props.mapStyle.metadata || {})['maputnik:openmaptiles_access_token']}
              onChange={this.changeMetadataProperty.bind(this, "maputnik:openmaptiles_access_token")}
            />
          </InputBlock>
          <InputBlock label={"Mapbox Access Token: "}>
            <StringInput
              value={(this.props.mapStyle.metadata || {})['maputnik:mapbox_access_token']}
              onChange={this.changeMetadataProperty.bind(this, "maputnik:mapbox_access_token")}
            />
          </InputBlock>
          <InputBlock label={"Thunderforest Access Token: "}>
            <StringInput
              value={(this.props.mapStyle.metadata || {})['maputnik:thunderforest_access_token']}
              onChange={this.changeMetadataProperty.bind(this, "maputnik:thunderforest_access_token")}
            />
          </InputBlock>
        </p>

        <Button onClick={this.downloadStyle.bind(this)}>
          <MdFileDownload />
          Download
        </Button>
      </div>

    </Modal>
  }
}

export default ExportModal
