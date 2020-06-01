import React from 'react'
import PropTypes from 'prop-types'

import {MdInfoOutline, MdHighlightOff} from 'react-icons/md'

export default class FieldDocLabel extends React.Component {
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]).isRequired,
    fieldSpec: PropTypes.object,
    onToggleDoc: PropTypes.func,
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
    const {label, fieldSpec} = this.props;
    const {doc} = fieldSpec || {};

    if (doc) {
      return <label className="maputnik-doc-wrapper">
        <div className="maputnik-doc-target">
          {label}
          {'\xa0'}
          <button
            aria-label={this.state.open ? "close property documentation" : "open property documentation"}
            className={`maputnik-doc-button maputnik-doc-button--${this.state.open ? 'open' : 'closed'}`}
            onClick={() => this.onToggleDoc(!this.state.open)}
          >
            {this.state.open ? <MdHighlightOff /> : <MdInfoOutline />}
          </button>
        </div>
      </label>
    }
    else if (label) {
      return <label className="maputnik-doc-wrapper">
        <div className="maputnik-doc-target">
          {label}
        </div>
      </label>
    }
    else {
      <div />
    }
  }
}
