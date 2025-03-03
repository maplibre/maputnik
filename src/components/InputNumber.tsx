import React, { BaseSyntheticEvent } from 'react'
import generateUniqueId from '../libs/document-uid';

export type InputNumberProps = {
  value?: number
  default?: number
  min?: number
  max?: number
  onChange?(value: number | undefined): unknown
  allowRange?: boolean
  rangeStep?: number
  "data-wd-key"?: string
  required?: boolean
  "aria-label"?: string
};

type InputNumberState = {
  uuid: number
  editing: boolean
  editingRange?: boolean
  value?: number
  /**
   * This is the value that is currently being edited. It can be an invalid value.
   */
  dirtyValue?: number | string | undefined
}

export default class InputNumber extends React.Component<InputNumberProps, InputNumberState> {
  static defaultProps = {
    rangeStep: 1
  }
  _keyboardEvent: boolean = false;

  constructor(props: InputNumberProps) {
    super(props)
    this.state = {
      uuid: +generateUniqueId(),
      editing: false,
      value: props.value,
      dirtyValue: props.value,
    }
  }

  static getDerivedStateFromProps(props: Readonly<InputNumberProps>, state: InputNumberState) {
    if (!state.editing && props.value !== state.value) {
      return {
        value: props.value,
        dirtyValue: props.value,
      };
    }
    return null;
  }

  changeValue(newValue: number | string | undefined) {
    const value = (newValue === "" || newValue === undefined) ?
      undefined : +newValue;

    const hasChanged = this.props.value !== value;
    if(this.isValid(value) && hasChanged) {
      if (this.props.onChange) this.props.onChange(value)
      this.setState({
        value: value,
      });
    }
    else if (!this.isValid(value) && hasChanged) {
      this.setState({
        value: undefined,
      });
    }

    this.setState({
      dirtyValue: newValue === "" ? undefined : newValue,
    })
  }

  isValid(v: number | string | undefined) {
    if (v === undefined) {
      return true;
    }

    const value = +v;
    if(isNaN(value)) {
      return false
    }

    if(!isNaN(this.props.min!) && value < this.props.min!) {
      return false
    }

    if(!isNaN(this.props.max!) && value > this.props.max!) {
      return false
    }

    return true
  }

  resetValue = () => {
    this.setState({editing: false});
    // Reset explicitly to default value if value has been cleared
    if(!this.state.value) {
      return;
    }

    // If set value is invalid fall back to the last valid value from props or at last resort the default value
    if (!this.isValid(this.state.value)) {
      if(this.isValid(this.props.value)) {
        this.changeValue(this.props.value)
        this.setState({dirtyValue: this.props.value});
      } else {
        this.changeValue(undefined);
        this.setState({dirtyValue: undefined});
      }
    }
  }

  onChangeRange = (e: BaseSyntheticEvent<Event, HTMLInputElement, HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    const step = this.props.rangeStep;
    let dirtyValue = value;

    if(step) {
      // Can't do this with the <input/> range step attribute else we won't be able to set a high precision value via the text input.
      const snap = value % step;

      // Round up/down to step
      if (this._keyboardEvent) {
        // If it's keyboard event we might get a low positive/negative value,
        // for example we might go from 13 to 13.23, however because we know
        // that came from a keyboard event we always want to increase by a
        // single step value.
        if (value < +this.state.dirtyValue!) {
          value = this.state.value! - step;
        }
        else {
          value = this.state.value! + step
        }
        dirtyValue = value;
      }
      else {
        if (snap < step/2) {
          value = value - snap;
        }
        else {
          value = value + (step - snap);
        }
      }
    }

    this._keyboardEvent = false;

    // Clamp between min/max
    value = Math.max(this.props.min!, Math.min(this.props.max!, value));

    this.setState({value, dirtyValue});
    if (this.props.onChange) this.props.onChange(value);
  }

  render() {
    if(
      Object.prototype.hasOwnProperty.call(this.props, "min") &&
      Object.prototype.hasOwnProperty.call(this.props, "max") &&
      this.props.min !== undefined && this.props.max !== undefined &&
      this.props.allowRange
    ) {
      const value = this.state.editing ? this.state.dirtyValue : this.state.value;
      const defaultValue = this.props.default === undefined ? "" : this.props.default;
      let inputValue;
      if (this.state.editingRange) {
        inputValue = this.state.value;
      }
      else {
        inputValue = value;
      }

      return <div className="maputnik-number-container">
        <input
          className="maputnik-number-range"
          key="range"
          type="range"
          max={this.props.max}
          min={this.props.min}
          step="any"
          spellCheck="false"
          value={value === undefined ? defaultValue : value}
          onChange={this.onChangeRange}
          onKeyDown={() => {
            this._keyboardEvent = true;
          }}
          onPointerDown={() => {
            this.setState({editing: true, editingRange: true});
          }}
          onPointerUp={() => {
            // Safari doesn't get onBlur event
            this.setState({editing: false, editingRange: false});
          }}
          onBlur={() => {
            this.setState({
              editing: false,
              editingRange: false,
              dirtyValue: this.state.value,
            });
          }}
          data-wd-key={this.props["data-wd-key"] + "-range"}
        />
        <input
          key="text"
          type="text"
          spellCheck="false"
          className="maputnik-number"
          placeholder={this.props.default?.toString()}
          value={inputValue === undefined ? "" : inputValue}
          onFocus={_e => {
            this.setState({editing: true});
          }}
          onChange={e => {
            this.changeValue(e.target.value);
          }}
          onBlur={_e => {
            this.setState({editing: false});
            this.resetValue()
          }}
          data-wd-key={this.props["data-wd-key"] + "-text"}

        />
      </div>
    }
    else {
      const value = this.state.editing ? this.state.dirtyValue : this.state.value;

      return <input
        aria-label={this.props['aria-label']}
        spellCheck="false"
        className="maputnik-number"
        placeholder={this.props.default?.toString()}
        value={value === undefined ? "" : value}
        onChange={e => this.changeValue(e.target.value)}
        onFocus={() => {
          this.setState({editing: true});
        }}
        onBlur={this.resetValue}
        required={this.props.required}
        data-wd-key={this.props["data-wd-key"]}
      />
    }
  }
}
