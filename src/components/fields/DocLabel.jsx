import React from 'react'
import PropTypes from 'prop-types'

export default class DocLabel extends React.Component {
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]).isRequired,
    doc: PropTypes.string.isRequired,
  }

  render() {
    return <label className="maputnik-doc-wrapper">
      <div className="maputnik-doc-target">
        <span>{this.props.label}</span>
        <div className="maputnik-doc-popup">
          {this.props.doc}
        </div>
      </div>
    </label>
  }
}
