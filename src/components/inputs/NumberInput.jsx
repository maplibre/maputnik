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
    console.log("getDerivedStateFromProps[%s]", state.uuid, props.value, state.value);
    if (!state.editing) {
      return {
        value: props.value,
        dirtyValue: props.value,
      };
    }
    return null;
  }

  changeValue(newValue) {
    const value = (newValue === "" || newValue === undefined) ?
      undefined :
      parseFloat(newValue);

    const hasChanged = this.props.value !== value;
    console.log("changeValue[%s]->hasChanged", this.state.uuid, value, this.isValid(value), this.props.value, "!==", value)
    if(this.isValid(value) && hasChanged) {
      console.log("changeValue[%s]->onChange", this.state.uuid, value);
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
    console.log("onChangeRange[%s]", this.state.uuid);
    if (this._cancelNextChangeEvent) {
      console.log("onChangeRange[%s]:cancel", this.state.uuid);
      this._cancelNextChangeEvent = false;
      return;
    }
    const value = parseFloat(e.target.value, 10);
    const step = this.props.rangeStep;
    let dirtyValue = value;

    if(step) {
      // Can't do this with the <input/> range step attribute else we won't be able to set a high precision value via the text input.
      const snap = value % step;

      // Round up/down to step
      if (snap < step/2) {
        dirtyValue = value - snap;
      }
      else {
        dirtyValue = value + (step - snap);
      };
    }

    this.setState({editing: true, value, dirtyValue});
  }

  render() {
    if(
      this.props.hasOwnProperty("min") && this.props.hasOwnProperty("max") &&
      this.props.min !== undefined && this.props.max !== undefined &&
      this.props.allowRange
    ) {
      const value = this.state.value === undefined ? this.props.default : this.state.value;
      const rangeValue = Number.isNaN(parseFloat(value, 10)) ? this.props.default : value;
      console.log("render[%s]", this.state.uuid, value, rangeValue);

      return <div className="maputnik-number-container">
        <input
          className="maputnik-number-range"
          key="range"
          type="range"
          max={this.props.max}
          min={this.props.min}
          step="any"
          spellCheck="false"
          value={rangeValue}
          onInput={this.onChangeRange}
          onMouseUp={() => console.log("mouseup")}
          onPointerDown={() => {
            this._cancelNextChangeEvent = false;
          }}
          onBlur={() => {
            console.log("onBlur[%s]", this.state.uuid);
            this.changeValue(this.state.dirtyValue);
          }}
          onPointerUp={() => {
            console.log("onPointerUp[%s]", this.state.uuid);
            this._cancelNextChangeEvent = true;
            this.changeValue(this.state.dirtyValue);
          }}
        />
        <input
          key="text"
          type="text"
          spellCheck="false"
          className="maputnik-number"
          placeholder={this.props.default}
          value={this.state.dirtyValue === undefined ? "" : this.state.dirtyValue}
          onChange={e => {
            console.log("input.text->onChange[%s]", this.state.uuid, e.target.value);
            this.changeValue(e.target.value)
          }}
          onBlur={this.resetValue}
        />
      </div>
    }
    else {
      return <input
        spellCheck="false"
        className="maputnik-number"
        placeholder={this.props.default}
        value={this.state.value === undefined ? "" : this.state.value}
        onChange={e => this.changeValue(e.target.value)}
        onBlur={this.resetValue}
        required={this.props.required}
      />
    }
  }
}

export default NumberInput
