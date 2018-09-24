import React from 'react'
import PropTypes from 'prop-types'
import Collapse from 'react-collapse'
import accessibility from '../../libs/accessibility'


export default class CollapseAlt extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired
  }

  static defaultProps = {
    isActive: true
  }

  render() {
    if (accessibility.reducedMotionEnabled()) {
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

