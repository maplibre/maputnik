import React from 'react'
import CloseIcon from 'react-icons/lib/md/close'
import Overlay from './Overlay'

class Modal extends React.Component {
  static propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    onOpenToggle: React.PropTypes.func.isRequired,
  }

  render() {
    return <Overlay isOpen={this.props.isOpen}>
      <div className="maputnik-modal">
        <header className="maputnik-modal-header">
          <h1 className="maputnik-modal-header-title">{this.props.title}</h1>
          <span className="maputnik-modal-header-space"></span>
          <a className="maputnik-modal-header-toggle"
            onClick={() => this.props.onOpenToggle(false)}
          >
            <CloseIcon />
          </a>
        </header>
        <div className="maputnik-modal-content">{this.props.children}</div>
      </div>
    </Overlay>
  }
}

export default Modal
