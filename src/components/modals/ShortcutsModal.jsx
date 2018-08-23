import React from 'react'
import PropTypes from 'prop-types'

import Modal from './Modal'


class ShortcutsModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
  }

  render() {
    const help = [
      {
        key: "?",
        text: "Shortcuts menu"
      },
      {
        key: "o",
        text: "Open modal"
      },
      {
        key: "e",
        text: "Export modal"
      },
      {
        key: "d",
        text: "Data Sources modal"
      },
      {
        key: "s",
        text: "Style Settings modal"
      },
      {
        key: "i",
        text: "Toggle inspect"
      },
      {
        key: "m",
        text: "Focus map"
      },
    ]


    return <Modal
      data-wd-key="shortcuts-modal"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Shortcuts'}
    >
      <div className="maputnik-modal-section maputnik-modal-shortcuts">
        <p>
          Press <code>ESC</code> to lose focus of any active elements, then press one of:
        </p>
        <ul>
          {help.map((item) => {
            return <li key={item.key}>
              <code>{item.key}</code> {item.text}
            </li>
          })}
        </ul>
      </div>
    </Modal>
  }
}

export default ShortcutsModal
