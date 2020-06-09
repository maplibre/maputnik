import React from 'react'
import PropTypes from 'prop-types'


let IDX = 0;

export default class Fieldset extends React.Component {
  constructor (props) {
    super(props);
    this._labelId = `fieldset_label_${(IDX++)}`;
  }

  render () {
    const {props} = this;

    return <div className="maputnik-input-block" role="group" aria-labelledby={this._labelId}>
      <div className="maputnik-input-block-label" id={this._labelId}>{props.label}</div>
      <div className="maputnik-input-block-content">
        {props.children}
      </div>
    </div>
  }
}
