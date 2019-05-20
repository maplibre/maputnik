import React from 'react'
import PropTypes from 'prop-types'

class NumberInput extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    default: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func,
    allowRange: PropTypes.bool,
    rangeStep: PropTypes.number,
  }

  static defaultProps = {
    rangeStep: 0.01
  }

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      value: props.value,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.editing) {
      return {
        value: props.value
      };
    }
  }

  changeValue(newValue) {
    this.setState({editing: true});
    const value = parseFloat(newValue)

    const hasChanged = this.state.value !== value
    if(this.isValid(value) && hasChanged) {
      this.props.onChange(value)
    }
    this.setState({ value: newValue })
  }

  isValid(v) {
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
      return this.changeValue(this.props.default)
    }

    // If set value is invalid fall back to the last valid value from props or at last resort the default value
    if(!this.isValid(this.state.value)) {
      if(this.isValid(this.props.value)) {
        this.changeValue(this.props.value)
      } else {
        this.changeValue(this.props.default)
      }
    }
  }

  onChangeRange = (e) => {
    const val = parseFloat(e.target.value, 10);
    const step = this.props.rangeStep;
    let out = val;

    if(step) {
      // Can't do this with the <input/> range step attribute else we won't be able to set a high precision value via the text input.
      const snap = val % step;

      // Round up/down to step
      if (snap < step/2) {
        out = val - snap;
      }
      else {
        out = val + (step - snap);
      };
    }

    this.changeValue(out);
  }

  render() {
    let rangeEl;

    if(
      this.props.hasOwnProperty("min") && this.props.hasOwnProperty("max") &&
      this.props.min !== undefined && this.props.max !== undefined &&
      this.props.allowRange
    ) {
      const value = this.props.value === undefined ? this.props.default : this.props.value;

      rangeEl = (
        <input
          className="maputnik-number-range"
          key="range"
          type="range"
          max={this.props.max}
          min={this.props.min}
          step="any"
          spellCheck="false"
          value={value}
          onChange={this.onChangeRange}
          onBlur={this.resetValue}
        />
      );
    }

    return <div className="maputnik-number-container">
      {rangeEl}
      <input
        key="text"
        spellCheck="false"
        className="maputnik-number"
        placeholder={this.props.default}
        value={this.state.value}
        onChange={e => this.changeValue(e.target.value)}
        onBlur={this.resetValue}
      />
    </div>
  }
}

export default NumberInput
