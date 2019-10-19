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

  constructor (props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  onToggleDoc = (open) => {
    this.setState({
      open,
    }, () => {
      if (this.props.onToggleDoc) {
        this.props.onToggleDoc(this.state.open);
      }
    });
  }

  render() {
    return <label className="maputnik-doc-wrapper">
      <div className="maputnik-doc-target">
        <span>
          {this.props.label}
          {'\xa0'}
          <button
            className={`maputnik-doc-button maputnik-doc-button--${this.state.open ? 'open' : 'closed'}`}
            onClick={() => this.onToggleDoc(!this.state.open)}
          >
            {this.state.open ? 'x' : '?'}
          </button>
        </span>
      </div>
    </label>
  }
}
