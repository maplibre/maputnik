import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button'
import Modal from './Modal'


class ShortcutsModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const help = [
      {
        key: "?",
        text: "Show shortcuts menu"
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
        key: "s",
        text: "Sources modal"
      },
      {
        key: "p",
        text: "Source settings modal"
      },
      {
        key: "i",
        text: "Toggle map"
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
      <div className="maputnik-modal-section">
        <ul>
          {help.map((item) => {
            return <li>
              <code>{item.key}</code> {item.text}
            </li>
          })}
        </ul>
        <p>
          <Button onClick={() => this.props.onOpenToggle()}>
            Close
          </Button>
        </p>
      </div>
    </Modal>
  }
}

export default ShortcutsModal
