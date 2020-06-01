import React from 'react'
import PropTypes from 'prop-types'

import Modal from './Modal'


export default class ModalDebug extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    renderer: PropTypes.string.isRequired,
    onChangeMaboxGlDebug: PropTypes.func.isRequired,
    onChangeOpenlayersDebug: PropTypes.func.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
    mapboxGlDebugOptions: PropTypes.object,
    openlayersDebugOptions: PropTypes.object,
    mapView: PropTypes.object,
  }

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
      <div className="maputnik-modal-section maputnik-modal-shortcuts">
        <h4>Options</h4>
        {this.props.renderer === 'mbgljs' &&
          <ul>
            {Object.entries(this.props.mapboxGlDebugOptions).map(([key, val]) => {
              return <li key={key}>
                <label>
                  <input type="checkbox" checked={val} onClick={(e) => this.props.onChangeMaboxGlDebug(key, e.target.checked)} /> {key}
                </label>
              </li>
            })}
          </ul>
        }
        {this.props.renderer === 'ol' &&
          <ul>
            {Object.entries(this.props.openlayersDebugOptions).map(([key, val]) => {
              return <li key={key}>
                <label>
                  <input type="checkbox" checked={val} onClick={(e) => this.props.onChangeOpenlayersDebug(key, e.target.checked)} /> {key}
                </label>
              </li>
            })}
          </ul>
        }
      </div>
      <div className="maputnik-modal-section">
        <h4>Links</h4>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.openstreetmap.org/#map=${osmZoom}/${osmLat}/${osmLon}`}
          >
            Open in OSM
          </a> &mdash; Opens the current view on openstreetmap.org
        </p>
      </div>
    </Modal>
  }
}

