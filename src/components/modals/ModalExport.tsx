import React from "react";
import Slugify from "slugify";
import {saveAs} from "file-saver";
import {version} from "maplibre-gl/package.json";
import {format} from "@maplibre/maplibre-gl-style-spec";
import {MdMap, MdSave} from "react-icons/md";
import {type WithTranslation, withTranslation} from "react-i18next";

import { FieldString } from "../FieldString";
import { InputButton } from "../InputButton";
import { Modal } from "./Modal";
import { replaceAccessTokens, stripAccessTokens } from "../../libs/style";
import { spec as fieldSpecAdditional } from "../../libs/field-spec-additional";
import type {OnStyleChangedCallback, StyleSpecificationWithId} from "../../libs/definitions";


const MAPLIBRE_GL_VERSION = version;
const showSaveFilePickerAvailable = typeof window.showSaveFilePicker === "function";


type ModalExportInternalProps = {
  mapStyle: StyleSpecificationWithId
  onStyleChanged: OnStyleChangedCallback
  isOpen: boolean
  onOpenToggle(): void
  onSetFileHandle(fileHandle: FileSystemFileHandle | null): unknown
  fileHandle: FileSystemFileHandle | null
} & WithTranslation;


const ModalExportInternal: React.FC<ModalExportInternalProps> = (props) => {

  function tokenizedStyle() {
    return format(
      stripAccessTokens(
        replaceAccessTokens(props.mapStyle)
      )
    );
  }

  function exportName() {
    if (props.mapStyle.name) {
      return Slugify(props.mapStyle.name, {
        replacement: "_",
        remove: /[*\-+~.()'"!:]/g,
        lower: true
      });
    } else {
      return props.mapStyle.id;
    }
  }

  function createHtml() {
    const tokenStyle = tokenizedStyle();
    const htmlTitle = props.mapStyle.name || props.t("Map");
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
    const name = exportName();
    saveAs(blob, name + ".html");
  }

  async function createFileHandle(): Promise<FileSystemFileHandle | null> {
    const pickerOpts: SaveFilePickerOptions = {
      types: [
        {
          description: "json",
          accept: {"application/json": [".json"]},
        },
      ],
      suggestedName: exportName(),
    };

    const fileHandle = await window.showSaveFilePicker(pickerOpts) as FileSystemFileHandle;
    props.onSetFileHandle(fileHandle);
    return fileHandle;
  }

  async function saveStyle() {
    const tokenStyle = tokenizedStyle();

    // it is not guaranteed that the File System Access API is available on all
    // browsers. If the function is not available, a fallback behavior is used.
    if (!showSaveFilePickerAvailable) {
      const blob = new Blob([tokenStyle], {type: "application/json;charset=utf-8"});
      const name = exportName();
      saveAs(blob, name + ".json");
      return;
    }

    let fileHandle = props.fileHandle;
    if (fileHandle == null) {
      fileHandle = await createFileHandle();
      props.onSetFileHandle(fileHandle);
      if (fileHandle == null) return;
    }

    const writable = await fileHandle.createWritable();
    await writable.write(tokenStyle);
    await writable.close();
    props.onOpenToggle();
  }

  async function saveStyleAs() {
    const tokenStyle = tokenizedStyle();

    const fileHandle = await createFileHandle();
    props.onSetFileHandle(fileHandle);
    if (fileHandle == null) return;

    const writable = await fileHandle.createWritable();
    await writable.write(tokenStyle);
    await writable.close();
    props.onOpenToggle();
  }

  function changeMetadataProperty(property: string, value: any) {
    const changedStyle = {
      ...props.mapStyle,
      metadata: {
        ...props.mapStyle.metadata as any,
        [property]: value
      }
    };
    props.onStyleChanged(changedStyle);
  }

  const t = props.t;
  const fsa = fieldSpecAdditional(t);
  return <Modal
    data-wd-key="modal:export"
    isOpen={props.isOpen}
    onOpenToggle={props.onOpenToggle}
    title={t("Save Style")}
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
          value={(props.mapStyle.metadata || {} as any)["maputnik:openmaptiles_access_token"]}
          onChange={changeMetadataProperty.bind(null, "maputnik:openmaptiles_access_token")}
        />
        <FieldString
          label={fsa.maputnik.thunderforest_access_token.label}
          fieldSpec={fsa.maputnik.thunderforest_access_token}
          value={(props.mapStyle.metadata || {} as any)["maputnik:thunderforest_access_token"]}
          onChange={changeMetadataProperty.bind(null, "maputnik:thunderforest_access_token")}
        />
        <FieldString
          label={fsa.maputnik.stadia_access_token.label}
          fieldSpec={fsa.maputnik.stadia_access_token}
          value={(props.mapStyle.metadata || {} as any)["maputnik:stadia_access_token"]}
          onChange={changeMetadataProperty.bind(null, "maputnik:stadia_access_token")}
        />
        <FieldString
          label={fsa.maputnik.locationiq_access_token.label}
          fieldSpec={fsa.maputnik.locationiq_access_token}
          value={(props.mapStyle.metadata || {} as any)["maputnik:locationiq_access_token"]}
          onChange={changeMetadataProperty.bind(null, "maputnik:locationiq_access_token")}
        />
      </div>

      <div className="maputnik-modal-export-buttons">
        <InputButton onClick={saveStyle}>
          <MdSave/>
          {t("Save")}
        </InputButton>
        {showSaveFilePickerAvailable && (
          <InputButton onClick={saveStyleAs}>
            <MdSave/>
            {t("Save as")}
          </InputButton>
        )}

        <InputButton onClick={createHtml}>
          <MdMap/>
          {t("Create HTML")}
        </InputButton>
      </div>
    </section>

  </Modal>;
};

export const ModalExport = withTranslation()(ModalExportInternal);
