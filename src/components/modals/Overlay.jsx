import React from 'react'
import PropTypes from 'prop-types'


class Overlay extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired
  }

  render() {
		let overlayStyle = {}
		if(!this.props.isOpen) {
			overlayStyle['display'] = 'none';
		}

    return <div className={"maputnik-overlay"} style={overlayStyle}>
			<div className={"maputnik-overlay-viewport"} />
      {this.props.children}
    </div>
  }
}

export default Overlay
