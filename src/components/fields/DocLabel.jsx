import React from 'react'

export default class DocLabel extends React.Component {
  static propTypes = {
    label: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.string
    ]).isRequired,
    doc: React.PropTypes.string.isRequired,
  }

  render() {
    return <label className="maputnik-doc-wrapper">
      <div className="maputnik-doc-target">
        <span>{this.props.label}</span>
        <div className="maputnik-doc-popup">
          {this.props.doc}
        </div>
      </div >
    </label>
  }
}
