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
      className="maputnik-button"
      style={this.props.style}>
      {this.props.children}
    </a>
  }
}

export default Button
