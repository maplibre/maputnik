import React from 'react'
import PropTypes from 'prop-types'
import CollapseOpenIcon from 'react-icons/lib/md/arrow-drop-down'
import CollapseCloseIcon from 'react-icons/lib/md/arrow-drop-up'

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

    const ariaProps = {
      "aria-hidden": true,
      focusable: false
    };

    return this.props.isCollapsed
      ? <CollapseCloseIcon {...ariaProps} style={iconStyle}/>
      : <CollapseOpenIcon {...ariaProps} style={iconStyle} />
  }
}

