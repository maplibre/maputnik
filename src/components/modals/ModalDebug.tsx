import React from "react";
import { debounce } from "lodash";
import { Trans, type WithTranslation, withTranslation } from "react-i18next";
import type { MapOptions } from "maplibre-gl";

import { Modal } from "./Modal";
import { FieldNumber } from "../FieldNumber";


type ModalDebugInternalProps = {
  isOpen: boolean
  renderer: string
  onChangeMaplibreGlDebug(key: string, value: boolean | number | undefined): unknown
  onChangeOpenlayersDebug(key: string, checked: boolean): unknown
  onOpenToggle(): void
  maplibreGlDebugOptions?: Partial<MapOptions>
  openlayersDebugOptions?: object
  mapView: {
    zoom: number
    center: {
      lng: number
      lat: number
    }
  }
} & WithTranslation;


class ModalDebugInternal extends React.Component<ModalDebugInternalProps> {
  // Typing "22" would otherwise apply 2 first and zoom the map out of the current view
  onChangeMaxZoom = debounce((value: number | undefined) => {
    this.props.onChangeMaplibreGlDebug("maxZoom", value);
  }, 500);

  componentWillUnmount() {
    this.onChangeMaxZoom.cancel();
  }

  render() {
    const {t, mapView} = this.props;

    const osmZoom = Math.round(mapView.zoom)+1;
    const osmLon = +(mapView.center.lng).toFixed(5);
    const osmLat = +(mapView.center.lat).toFixed(5);

    return <Modal
      data-wd-key="modal:debug"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={t("Debug")}
    >
      <section className="maputnik-modal-section maputnik-modal-shortcuts">
        <h1>{t("Options")}</h1>
        {this.props.renderer === "mlgljs" &&
          <>
            <ul>
              {Object.entries(this.props.maplibreGlDebugOptions!).filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean").map(([key, val]) => {
                return <li key={key}>
                  <label>
                    <input type="checkbox" checked={val} onChange={(e) => this.props.onChangeMaplibreGlDebug(key, e.target.checked)} /> {key}
                  </label>
                </li>;
              })}
            </ul>
            <FieldNumber
              label={t("Max Zoom")}
              data-wd-key="modal:debug.max-zoom"
              value={this.props.maplibreGlDebugOptions!.maxZoom ?? undefined}
              min={0}
              onChange={this.onChangeMaxZoom}
            />
          </>
        }
        {this.props.renderer === "ol" &&
          <ul>
            {Object.entries(this.props.openlayersDebugOptions!).map(([key, val]) => {
              return <li key={key}>
                <label>
                  <input type="checkbox" checked={val} onChange={(e) => this.props.onChangeOpenlayersDebug(key, e.target.checked)} /> {key}
                </label>
              </li>;
            })}
          </ul>
        }
      </section>
      <section className="maputnik-modal-section">
        <h1>{t("Links")}</h1>
        <p>
          <Trans t={t}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.openstreetmap.org/#map=${osmZoom}/${osmLat}/${osmLon}`}
            >
              Open in OSM
            </a>. Opens the current view on openstreetmap.org
          </Trans>
        </p>
      </section>
    </Modal>;
  }
}

export const ModalDebug = withTranslation()(ModalDebugInternal);
