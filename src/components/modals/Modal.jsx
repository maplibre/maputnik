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
      <div style={{
        minWidth: 350,
        maxWidth: 600,
        backgroundColor: colors.black,
        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          backgroundColor: colors.gray,
          display: 'flex',
          flexDirection: 'row',
          padding: margins[2],
          fontSize: fontSizes[4],
        }}>
          {this.props.title}
          <span style={{flexGrow: 1}} />
          <a
            onClick={this.props.toggleOpen(false)}
            style={{ cursor: 'pointer' }} >
            <CloseIcon />
          </a>
        </div>
        <div style={{
          padding: margins[2],
        }}>
          {this.props.children}
        </div>
      </div>
    </Overlay>
  }
}

export default Modal
