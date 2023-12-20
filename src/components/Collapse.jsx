import React from 'react'
import PropTypes from 'prop-types'
import { Collapse as ReactCollapse } from 'react-collapse'
import {reducedMotionEnabled} from '../../libs/accessibility'


export default class Collapse extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired
  }

  static defaultProps = {
    isActive: true
  }

  render() {
    if (reducedMotionEnabled()) {
      return (
        <div style={{display: this.props.isActive ? "block" : "none"}}>
          {this.props.children}
        </div>
      )
    }
    else {
      return (
        <ReactCollapse isOpened={this.props.isActive}>
          {this.props.children}
        </ReactCollapse>
      )
    }
  }
}

