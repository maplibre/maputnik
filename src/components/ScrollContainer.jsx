import React from 'react'
import PropTypes from 'prop-types'

class ScrollContainer extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return <div className="maputnik-scroll-container">
      {this.props.children}
    </div>
  }
}

export default ScrollContainer
