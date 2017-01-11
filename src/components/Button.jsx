import React from 'react'
import classnames from 'classnames'
import colors from '../config/colors'
import { margins, fontSizes } from '../config/scales'

class Button extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
  }

  render() {
    return <a
      onClick={this.props.onClick}
      className={classnames("maputnik-button", this.props.className)}
      style={this.props.style}>
      {this.props.children}
    </a>
  }
}

export default Button
