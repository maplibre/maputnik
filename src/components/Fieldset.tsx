import React from 'react'
import FieldDocLabel from './FieldDocLabel'
import Doc from './Doc'

type FieldsetProps = {
  label: string,
  fieldSpec?: { doc?: string },
  action?: string,
};

type FieldsetState = {
  showDoc: boolean
};

let IDX = 0;

export default class Fieldset extends React.Component<FieldsetProps, FieldsetState> {
  _labelId: string;

  constructor (props: FieldsetProps) {
    super(props);
    this._labelId = `fieldset_label_${(IDX++)}`;
    this.state = {
      showDoc: false,
    }
  }

  onToggleDoc = (val: boolean) => {
    this.setState({
      showDoc: val
    });
  }

  render () {
    return <div className="maputnik-input-block" role="group" aria-labelledby={this._labelId}>
      {this.props.fieldSpec &&
        <div className="maputnik-input-block-label">
          <FieldDocLabel
            label={this.props.label}
            onToggleDoc={this.onToggleDoc}
            fieldSpec={this.props.fieldSpec}
          />
        </div>
      }
      {!this.props.fieldSpec &&
        <div className="maputnik-input-block-label">
          {this.props.label}
        </div>
      }
      <div className="maputnik-input-block-action">
        {this.props.action}
      </div>
      <div className="maputnik-input-block-content">
        {this.props.children}
      </div>
      {this.props.fieldSpec &&
        <div
          className="maputnik-doc-inline"
          style={{display: this.state.showDoc ? '' : 'none'}}
        >
          <Doc fieldSpec={this.props.fieldSpec} />
        </div>
      }
    </div>
  }
}
