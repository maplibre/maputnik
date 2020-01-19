import React from 'react'
import PropTypes from 'prop-types'

let IDX = 0;

class NumberInput extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    default: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func,
    allowRange: PropTypes.bool,
    rangeStep: PropTypes.number,
    wdKey: PropTypes.string,
    required: PropTypes.bool,
  }

  static defaultProps = {
    rangeStep: 1
  }

  constructor(props) {
    super(props)
    this.state = {
      uuid: IDX++,
      editing: false,
      value: props.value,
      dirtyValue: props.value,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.editing) {
      return {
        value: props.value,
      };
    }
    return null;
  }

  changeValue(newValue) {
    const value = (newValue === "" || newValue === undefined) ?
      undefined :
      parseFloat(newValue);

    const hasChanged = this.props.value !== value;
    if(this.isValid(value) && hasChanged) {
      this.props.onChange(value)
    }
    this.setState({
      value: newValue,
      dirtyValue: newValue,
    })
  }

  isValid(v) {
    if (v === undefined) {
      return true;
    }

    const value = parseFloat(v)
    if(isNaN(value)) {
      return false
    }

    if(!isNaN(this.props.min) && value < this.props.min) {
      return false
    }

    if(!isNaN(this.props.max) && value > this.props.max) {
      return false
    }

    return true
  }

  resetValue = () => {
    this.setState({editing: false});
    // Reset explicitly to default value if value has been cleared
    if(this.state.value === "") {
      return;
    }

    // If set value is invalid fall back to the last valid value from props or at last resort the default value
    if(!this.isValid(this.state.value)) {
      if(this.isValid(this.props.value)) {
        this.changeValue(this.props.value)
      } else {
        this.changeValue(undefined);
      }
    }
  }

  onChangeRange = (e) => {
    let value = parseFloat(e.target.value, 10);
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
        if (value < this.state.value) {
          value = value - snap;
        }
        else {
          value = value - snap + snap;
        }
      }
      else {
        if (snap < step/2) {
          value = value - snap;
        }
        else {
          value = value + (step - snap);
        };
      }
    }

    this._keyboardEvent = false;

    // Clamp between min/max
    value = Math.max(this.props.min, Math.min(this.props.max, value));

    this.setState({editing: true, value, dirtyValue});
    this.props.onChange(value);
  }

  render() {
    if(
      this.props.hasOwnProperty("min") && this.props.hasOwnProperty("max") &&
      this.props.min !== undefined && this.props.max !== undefined &&
      this.props.allowRange
    ) {
      const dirtyValue = this.state.dirtyValue === undefined ? this.props.default : this.state.dirtyValue
      const value = this.state.value === undefined ? "" : this.state.value;

      return <div className="maputnik-number-container">
        <input
          className="maputnik-number-range"
          key="range"
          type="range"
          max={this.props.max}
          min={this.props.min}
          step="any"
          spellCheck="false"
          value={dirtyValue}
          aria-hidden="true"
          onChange={this.onChangeRange}
          onKeyDown={() => {
            this._keyboardEvent = true;
          }}
          onBlur={() => {
            this.setState({editing: false});
          }}
        />
        <input
          key="text"
          type="text"
          spellCheck="false"
          className="maputnik-number"
          placeholder={this.props.default}
          value={value}
          onChange={e => {
            if (!this.state.editing) {
              this.changeValue(e.target.value);
            }
          }}
          onBlur={this.resetValue}
        />
      </div>
    }
    else {
      const value = this.state.value === undefined ? "" : this.state.value;

      return <input
        spellCheck="false"
        className="maputnik-number"
        placeholder={this.props.default}
        value={value}
        onChange={e => this.changeValue(e.target.value)}
        onBlur={this.resetValue}
        required={this.props.required}
      />
    }
  }
}

export default NumberInput
