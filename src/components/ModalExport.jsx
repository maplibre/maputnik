import React from 'react'
import PropTypes from 'prop-types'
import Slugify from 'slugify'
import { saveAs } from 'file-saver'
import pkgLockJson from '../../package-lock.json'

import {format} from '@mapbox/mapbox-gl-style-spec'
import FieldString from './FieldString'
import FieldCheckbox from './FieldCheckbox'
import InputButton from './InputButton'
import Modal from './Modal'
import {MdFileDownload} from 'react-icons/md'
import style from '../libs/style'
import fieldSpecAdditional from '../libs/field-spec-additional'


const MAPBOX_GL_VERSION = pkgLockJson.dependencies["mapbox-gl"].version;


export default class ModalExport extends React.Component {
  static propTypes = {
    mapStyle: PropTypes.object.isRequired,
    onStyleChanged: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  tokenizedStyle () {
    return format(
      style.stripAccessTokens(
        style.replaceAccessTokens(this.props.mapStyle)
      )
    );
  }

  exportName () {
    if(this.props.mapStyle.name) {
      return Slugify(this.props.mapStyle.name, {
        replacement: '_',
        remove: /[*\-+~.()'"!:]/g,
        lower: true
      });
    } else {
      return this.props.mapStyle.id
    }
  }

  downloadHtml() {
    const tokenStyle = this.tokenizedStyle();
    const htmlTitle = this.props.mapStyle.name || "Map";
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${htmlTitle}</title>
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_GL_VERSION}/mapbox-gl.js"></script>
  <link href="https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_GL_VERSION}/mapbox-gl.css" rel="stylesheet" />
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
      mapboxgl.accessToken = 'access_token';
      const map = new mapboxgl.Map({
         container: 'map',
         style: ${tokenStyle},
      });
      map.addControl(new mapboxgl.NavigationControl());
  </script>
</body>
</html>
`;

    const blob = new Blob([html], {type: "text/html;charset=utf-8"});
    const exportName = this.exportName();
    saveAs(blob, exportName + ".html");
  }

  downloadStyle() {
    const tokenStyle = this.tokenizedStyle();
    const blob = new Blob([tokenStyle], {type: "application/json;charset=utf-8"});
    const exportName = this.exportName();
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
      data-wd-key="modal:export"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Export Style'}
      className="maputnik-export-modal"
    >

      <section className="maputnik-modal-section">
        <h1>Download Style</h1>
        <p>
          Download a JSON style to your computer.
        </p>

        <div>
          <FieldString
            label={fieldSpecAdditional.maputnik.mapbox_access_token.label}
            fieldSpec={fieldSpecAdditional.maputnik.mapbox_access_token}
            value={(this.props.mapStyle.metadata || {})['maputnik:mapbox_access_token']}
            onChange={this.changeMetadataProperty.bind(this, "maputnik:mapbox_access_token")}
          />
          <FieldString
            label={fieldSpecAdditional.maputnik.maptiler_access_token.label}
            fieldSpec={fieldSpecAdditional.maputnik.maptiler_access_token}
            value={(this.props.mapStyle.metadata || {})['maputnik:openmaptiles_access_token']}
            onChange={this.changeMetadataProperty.bind(this, "maputnik:openmaptiles_access_token")}
          />
          <FieldString
            label={fieldSpecAdditional.maputnik.thunderforest_access_token.label}
            fieldSpec={fieldSpecAdditional.maputnik.thunderforest_access_token}
            value={(this.props.mapStyle.metadata || {})['maputnik:thunderforest_access_token']}
            onChange={this.changeMetadataProperty.bind(this, "maputnik:thunderforest_access_token")}
          />
        </div>

        <div className="maputnik-modal-export-buttons">
          <InputButton
            onClick={this.downloadStyle.bind(this)}
          >
            <MdFileDownload />
            Download Style
          </InputButton>

          <InputButton
            onClick={this.downloadHtml.bind(this)}
          >
            <MdFileDownload />
            Download HTML
          </InputButton>
        </div>
      </section>

    </Modal>
  }
}

