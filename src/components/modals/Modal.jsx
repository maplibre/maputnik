import React from 'react'

import CloseIcon from 'react-icons/lib/md/close'

import Overlay from './Overlay'
import colors from '../../config/colors'
import { margins } from '../../config/scales'

class Modal extends React.Component {
  static propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    toggleOpen: React.PropTypes.func.isRequired,
  }

  render() {
    return <Overlay isOpen={this.props.isOpen}>
      <div style={{
        backgroundColor: colors.gray,
      }}>
        <div style={{
          backgroundColor: colors.midgray,
          display: 'flex',
          flexDirection: 'row',
          padding: margins[1]
        }}>
          {this.props.title}
          <span style={{flexGrow: 1}} />
          <a onClick={this.props.toggleOpen(false)}>
            <CloseIcon />
          </a>
        </div>
        <div style={{
          padding: margins[1]
        }}>
          {this.props.children}
        </div>
      </div>
    </Overlay>
  }
}

export default Modal
