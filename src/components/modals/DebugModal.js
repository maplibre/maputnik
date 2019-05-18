import React from 'react'
import PropTypes from 'prop-types'

import Modal from './Modal'


class DebugModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onChangeDebug: PropTypes.func.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
    debugOptions: PropTypes.object,
  }

  render() {
    return <Modal
      data-wd-key="debug-modal"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Debug'}
    >
      <div className="maputnik-modal-section maputnik-modal-shortcuts">
        <ul>
          {Object.entries(this.props.debugOptions).map(([key, val]) => {
            return <li key={key}>
              <label>
                <input type="checkbox" value={val} onClick={(e) => this.props.onChangeDebug(key, e.target.checked)} /> {key}
              </label>
            </li>
          })}
        </ul>
      </div>
    </Modal>
  }
}

export default DebugModal;
