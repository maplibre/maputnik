import React from 'react'
import PropTypes from 'prop-types'
import './SmallError.scss';


class SmallError extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render () {
    return (
      <div className="SmallError">
        Error: {this.props.children}
      </div>
    );
  }
}

export default SmallError
