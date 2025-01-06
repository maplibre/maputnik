import React from 'react'
import Slugify from 'slugify'
import {saveAs} from 'file-saver'
import {version} from 'maplibre-gl/package.json'
import {format} from '@maplibre/maplibre-gl-style-spec'
import type {StyleSpecification} from 'maplibre-gl'
import {MdSave} from 'react-icons/md'
import { WithTranslation, withTranslation } from 'react-i18next';

import FieldString from './FieldString'
import InputButton from './InputButton'
import Modal from './Modal'
import style from '../libs/style'
import fieldSpecAdditional from '../libs/field-spec-additional'


const MAPLIBRE_GL_VERSION = version;


type ModalExportInternalProps = {
  mapStyle: StyleSpecification & { id: string }
  onStyleChanged(...args: unknown[]): unknown
  isOpen: boolean
  onOpenToggle(...args: unknown[]): unknown
} & WithTranslation;


class ModalExportInternal extends React.Component<ModalExportInternalProps> {

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
    const htmlTitle = this.props.mapStyle.name || this.props.t("Map");
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${htmlTitle}</title>
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <script src="https://unpkg.com/maplibre-gl@${MAPLIBRE_GL_VERSION}/dist/maplibre-gl.js"></script>
  <link href="https://unpkg.com/maplibre-gl@${MAPLIBRE_GL_VERSION}/dist/maplibre-gl.css" rel="stylesheet" />
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
      const map = new maplibregl.Map({
         container: 'map',
         style: ${tokenStyle},
      });
      map.addControl(new maplibregl.NavigationControl());
  </script>
</body>
</html>
`;

    const blob = new Blob([html], {type: "text/html;charset=utf-8"});
    const exportName = this.exportName();
    saveAs(blob, exportName + ".html");
  }

  async saveStyle() {
    const fileHandle = null;
    const tokenStyle = this.tokenizedStyle();

    if (fileHandle != null) {
      const writable = await fileHandle.createWritable();
      await writable.write(tokenStyle);
      writable.flush();
      await writable.close();
    } else {
      // TODO
    }
  }

  async saveStyleAs() {
    const fileHandle = null;
    const tokenStyle = this.tokenizedStyle();

    const root = await navigator.storage.getDirectory();
    const draftHandle = await root.getFileHandle(this.exportName(), { create: true });
    const accessHandle = await draftHandle.createSyncAccessHandle();

    accessHandle.write(tokenStyle);
    accessHandle.flush();
  }

  changeMetadataProperty(property: string, value: any) {
    const changedStyle = {
      ...this.props.mapStyle,
      metadata: {
        ...this.props.mapStyle.metadata as any,
        [property]: value
      }
    }
    this.props.onStyleChanged(changedStyle)
  }


  render() {
    const t = this.props.t;
    const fsa = fieldSpecAdditional(t);
    return <Modal
      data-wd-key="modal:export"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={t('Save Style')}
      className="maputnik-export-modal"
    >

      <section className="maputnik-modal-section">
        <h1>{t("Save Style")}</h1>
        <p>
          {t("Save the JSON style to your computer.")}
        </p>

        <div>
          <FieldString
            label={fsa.maputnik.maptiler_access_token.label}
            fieldSpec={fsa.maputnik.maptiler_access_token}
            value={(this.props.mapStyle.metadata || {} as any)['maputnik:openmaptiles_access_token']}
            onChange={this.changeMetadataProperty.bind(this, "maputnik:openmaptiles_access_token")}
          />
          <FieldString
            label={fsa.maputnik.thunderforest_access_token.label}
            fieldSpec={fsa.maputnik.thunderforest_access_token}
            value={(this.props.mapStyle.metadata || {} as any)['maputnik:thunderforest_access_token']}
            onChange={this.changeMetadataProperty.bind(this, "maputnik:thunderforest_access_token")}
          />
          <FieldString
            label={fsa.maputnik.stadia_access_token.label}
            fieldSpec={fsa.maputnik.stadia_access_token}
            value={(this.props.mapStyle.metadata || {} as any)['maputnik:stadia_access_token']}
            onChange={this.changeMetadataProperty.bind(this, "maputnik:stadia_access_token")}
          />
        </div>

        <div className="maputnik-modal-export-buttons">
          <InputButton
            onClick={this.saveStyle.bind(this)}
          >
            <MdSave />
            {t("Save Style")}
          </InputButton>
          <InputButton
            onClick={this.saveStyleAs.bind(this)}
          >
            <MdSave />
            {t("Save Style as")}
          </InputButton>

          <InputButton
            onClick={this.downloadHtml.bind(this)}
          >
            <MdSave />
            {t("Download HTML")}
          </InputButton>
        </div>
      </section>

    </Modal>
  }
}

const ModalExport = withTranslation()(ModalExportInternal);
export default ModalExport;
