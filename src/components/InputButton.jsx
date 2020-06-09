import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class InputButton extends React.Component {
  static propTypes = {
    "data-wd-key": PropTypes.string,
    "aria-label": PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
  }

  render() {
    return <button
      id={this.props.id}
      title={this.props.title}
      type={this.props.type}
      onClick={this.props.onClick}
      disabled={this.props.disabled}
      aria-label={this.props["aria-label"]}
      className={classnames("maputnik-button", this.props.className)}
      data-wd-key={this.props["data-wd-key"]}
      style={this.props.style}
    >
      {this.props.children}
    </button>
  }
}

