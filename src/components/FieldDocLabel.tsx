import React from 'react'
import {MdInfoOutline, MdHighlightOff} from 'react-icons/md'

type FieldDocLabelProps = {
  label: object | string | undefined
  fieldSpec?: {
    doc?: string
  }
  onToggleDoc?(...args: unknown[]): unknown
};

type FieldDocLabelState = {
  open: boolean
};

export default class FieldDocLabel extends React.Component<FieldDocLabelProps, FieldDocLabelState> {
  constructor (props: FieldDocLabelProps) {
    super(props);
    this.state = {
      open: false,
    }
  }

  onToggleDoc = (open: boolean) => {
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
            data-wd-key={'field-doc-button-'+label}
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
