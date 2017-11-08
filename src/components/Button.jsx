import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class Button extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node
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
