import React from 'react'
import CollapseOpenIcon from 'react-icons/lib/md/arrow-drop-down'
import CollapseCloseIcon from 'react-icons/lib/md/arrow-drop-up'

export default class Collapser extends React.Component {
  static propTypes = {
    isCollapsed: React.PropTypes.bool.isRequired,
    style: React.PropTypes.object,
  }

  render() {
    const iconStyle = {
      width: 20,
      height: 20,
      ...this.props.style,
    }
    return this.props.isCollapsed ? <CollapseCloseIcon style={iconStyle}/> : <CollapseOpenIcon style={iconStyle} />
  }
}

