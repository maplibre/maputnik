import React from 'react'
import PropTypes from 'prop-types'
import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md'

export default class Collapser extends React.Component {
  static propTypes = {
    isCollapsed: PropTypes.bool.isRequired,
    style: PropTypes.object,
  }

  render() {
    const iconStyle = {
      width: 20,
      height: 20,
      ...this.props.style,
    }
    return this.props.isCollapsed ? <MdArrowDropUp style={iconStyle}/> : <MdArrowDropDown style={iconStyle} />
  }
}

