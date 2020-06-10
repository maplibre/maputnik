import React from 'react'
import PropTypes from 'prop-types'

import Modal from './Modal'


export default class ModalShortcuts extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
  }

  render() {
    const help = [
      {
        key: <kbd>?</kbd>,
        text: "Shortcuts menu"
      },
      {
        key: <kbd>o</kbd>,
        text: "Open modal"
      },
      {
        key: <kbd>e</kbd>,
        text: "Export modal"
      },
      {
        key: <kbd>d</kbd>,
        text: "Data Sources modal"
      },
      {
        key: <kbd>s</kbd>,
        text: "Style Settings modal"
      },
      {
        key: <kbd>i</kbd>,
        text: "Toggle inspect"
      },
      {
        key: <kbd>m</kbd>,
        text: "Focus map"
      },
      {
        key: <kbd>!</kbd>,
        text: "Debug modal"
      },
    ]


    const mapShortcuts = [
      {
        key: <kbd>+</kbd>,
        text: "Increase the zoom level by 1.",
      },
      {
        key: <><kbd>Shift</kbd> + <kbd>+</kbd></>,
        text: "Increase the zoom level by 2.",
      },
      {
        key: <kbd>-</kbd>,
        text: "Decrease the zoom level by 1.",
      },
      {
        key: <><kbd>Shift</kbd> + <kbd>-</kbd></>,
        text: "Decrease the zoom level by 2.",
      },
      {
        key: <kbd>Up</kbd>,
        text: "Pan up by 100 pixels.",
      },
      {
        key: <kbd>Down</kbd>,
        text: "Pan down by 100 pixels.",
      },
      {
        key: <kbd>Left</kbd>,
        text: "Pan left by 100 pixels.",
      },
      {
        key: <kbd>Right</kbd>,
        text: "Pan right by 100 pixels.",
      },
      {
        key: <><kbd>Shift</kbd> + <kbd>Right</kbd></>,
        text: "Increase the rotation by 15 degrees.",
      },
      {
        key: <><kbd>Shift</kbd> + <kbd>Left</kbd></>,
        text: "Decrease the rotation by 15 degrees."
      },
      {
        key: <><kbd>Shift</kbd> + <kbd>Up</kbd></>,
        text: "Increase the pitch by 10 degrees."
      },
      {
        key: <><kbd>Shift</kbd> + <kbd>Down</kbd></>,
        text: "Decrease the pitch by 10 degrees."
      },
    ]


    return <Modal
      data-wd-key="modal:shortcuts"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Shortcuts'}
    >
      <section className="maputnik-modal-section maputnik-modal-shortcuts">
        <p>
          Press <code>ESC</code> to lose focus of any active elements, then press one of:
        </p>
        <dl>
          {help.map((item, idx) => {
            return <div key={idx} className="maputnik-modal-shortcuts__shortcut">
              <dt key={"dt"+idx}>{item.key}</dt>
              <dd key={"dd"+idx}>{item.text}</dd>
            </div>
          })}
        </dl>
        <p>If the Map is in focused you can use the following shortcuts</p>
        <ul>
          {mapShortcuts.map((item, idx) => {
            return <li key={idx}>
              <span>{item.key}</span> {item.text}
            </li>
          })}
        </ul>
      </section>
    </Modal>
  }
}

