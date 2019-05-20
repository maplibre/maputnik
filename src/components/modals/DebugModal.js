import React from 'react'
import PropTypes from 'prop-types'

import Modal from './Modal'


class DebugModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    renderer: PropTypes.string.isRequired,
    onChangeMaboxGlDebug: PropTypes.func.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
    mapboxGlDebugOptions: PropTypes.object,
  }

  render() {
    return <Modal
      data-wd-key="debug-modal"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Debug'}
    >
      <div className="maputnik-modal-section maputnik-modal-shortcuts">
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
          <div>
            No debug options available for the OpenLayers renderer
          </div>
        }
      </div>
    </Modal>
  }
}

export default DebugModal;