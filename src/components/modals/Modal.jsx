import React from 'react'

import CloseIcon from 'react-icons/lib/md/close'

import Overlay from './Overlay'
import colors from '../../config/colors'
import { margins, fontSizes } from '../../config/scales'

class Modal extends React.Component {
  static propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    onOpenToggle: React.PropTypes.func.isRequired,
  }

  render() {
    return <Overlay isOpen={this.props.isOpen}>
      <div className="maputnik-modal">
        <div className="maputnik-modal-header">
          <span className="maputnik-modal-header-title">{this.props.title}</span>
          <span style={{flexGrow: 1}} />
          <a className="maputnik-modal-header-toggle"
            onClick={() => this.props.onOpenToggle(false)}
            style={{ cursor: 'pointer' }} >
            <CloseIcon />
          </a>
        </div>
        <div className="maputnik-modal-content">{this.props.children}</div>
      </div>
    </Overlay>
  }
}

export default Modal
