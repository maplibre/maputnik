import React from 'react'

import Modal from './Modal'


type ModalDebugProps = {
  isOpen: boolean
  renderer: string
  onChangeMaboxGlDebug(...args: unknown[]): unknown
  onChangeOpenlayersDebug(...args: unknown[]): unknown
  onOpenToggle(...args: unknown[]): unknown
  maplibreGlDebugOptions?: object
  openlayersDebugOptions?: object
  mapView: {
    zoom: number
    center: {
      lng: string
      lat: string
    }
  }
};


export default class ModalDebug extends React.Component<ModalDebugProps> {
  render() {
    const {mapView} = this.props;

    const osmZoom = Math.round(mapView.zoom)+1;
    const osmLon = Number.parseFloat(mapView.center.lng).toFixed(5);
    const osmLat = Number.parseFloat(mapView.center.lat).toFixed(5);

    return <Modal
      data-wd-key="modal:debug"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Debug'}
    >
      <section className="maputnik-modal-section maputnik-modal-shortcuts">
        <h1>Options</h1>
        {this.props.renderer === 'mlgljs' &&
          <ul>
            {Object.entries(this.props.maplibreGlDebugOptions!).map(([key, val]) => {
              return <li key={key}>
                <label>
                  <input type="checkbox" checked={val} onChange={(e) => this.props.onChangeMaboxGlDebug(key, e.target.checked)} /> {key}
                </label>
              </li>
            })}
          </ul>
        }
        {this.props.renderer === 'ol' &&
          <ul>
            {Object.entries(this.props.openlayersDebugOptions!).map(([key, val]) => {
              return <li key={key}>
                <label>
                  <input type="checkbox" checked={val} onChange={(e) => this.props.onChangeOpenlayersDebug(key, e.target.checked)} /> {key}
                </label>
              </li>
            })}
          </ul>
        }
      </section>
      <section className="maputnik-modal-section">
        <h1>Links</h1>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.openstreetmap.org/#map=${osmZoom}/${osmLat}/${osmLon}`}
          >
            Open in OSM
          </a> &mdash; Opens the current view on openstreetmap.org
        </p>
      </section>
    </Modal>
  }
}

