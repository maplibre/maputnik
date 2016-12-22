import React from 'react'
import colors from '../config/colors'
import { margins, fontSizes } from '../config/scales'

class Button extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func,
    style: React.PropTypes.object,
  }

  render() {
    return <a
      onClick={this.props.onClick}
      style={{
        cursor: 'pointer',
        backgroundColor: colors.midgray,
        color: colors.lowgray,
        fontSize: fontSizes[4],
        padding: margins[1],
        userSelect: 'none',
        borderRadius: 2,
        ...this.props.style,
      }}>
      {this.props.children}
    </a>
  }
}

export default Button
