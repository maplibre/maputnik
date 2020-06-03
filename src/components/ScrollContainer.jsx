import React from 'react'
import PropTypes from 'prop-types'

export default class ScrollContainer extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return <div className="maputnik-scroll-container">
      {this.props.children}
    </div>
  }
}

