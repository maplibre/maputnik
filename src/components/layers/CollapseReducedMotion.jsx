import React from 'react'
import PropTypes from 'prop-types'
import Collapse from 'react-collapse'
import lodash from 'lodash'


// Wait 3 seconds so when a user enables it they don't have to refresh the page.
const isReduceMotionEnabled = lodash.throttle(() => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}, 3000);

export default class CollapseReducedMotion extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired
  }

  render() {
    if (isReduceMotionEnabled()) {
      return (
        <div style={{display: this.props.isActive ? "block" : "none"}}>
          {this.props.children}
        </div>
      )
    }
    else {
      return (
        <Collapse isOpened={this.props.isActive}>
          {this.props.children}
        </Collapse>
      )
    }
  }
}

