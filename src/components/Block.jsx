import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import FieldDocLabel from './FieldDocLabel'
import Doc from './Doc'


/** Wrap a component with a label */
export default class Block extends React.Component {
  static propTypes = {
    "data-wd-key": PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    action: PropTypes.element,
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func,
    fieldSpec: PropTypes.object,
    wideMode: PropTypes.bool,
    error: PropTypes.array,
  }

  constructor (props) {
    super(props);
    this.state = {
      showDoc: false,
    }
  }

  onChange(e) {
    const value = e.target.value
    return this.props.onChange(value === "" ? undefined : value)
  }

  onToggleDoc = (val) => {
    this.setState({
      showDoc: val
    });
  }

  /**
   * Some fields for example <InputColor/> bind click events inside the element
   * to close the picker. This in turn propagates to the <label/> element
   * causing the picker to reopen. This causes a scenario where the picker can
   * never be closed once open.
   */
  onLabelClick = (event) => {
    const el = event.nativeEvent.target;
    const nativeEvent = event.nativeEvent;
    const contains = this._blockEl.contains(el);

    if (event.nativeEvent.target.nodeName !== "INPUT" && !contains) {
      event.stopPropagation();
    }
		event.preventDefault();
  }

  render() {
    const errors = [].concat(this.props.error || []);

    return <label style={this.props.style}
      data-wd-key={this.props["data-wd-key"]}
      className={classnames({
        "maputnik-input-block": true,
        "maputnik-input-block--wide": this.props.wideMode,
        "maputnik-action-block": this.props.action
      })}
      onClick={this.onLabelClick}
    >
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
      <div className="maputnik-input-block-content" ref={el => this._blockEl = el}>
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
    </label>
  }
}

