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
    wdKey: PropTypes.string,
  }

  static defaultProps = {
    rangeStep: 1
  }

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      value: props.value,
      dirtyValue: props.value,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.editing) {
      return {
        value: props.value,
        dirtyValue: props.value,
      };
    }
    else {
      return null;
    }
  }

  changeValue(newValue) {
    this.setState({editing: true});
    const value = parseFloat(newValue)

    const hasChanged = this.state.value !== value;
    if(this.isValid(value) && hasChanged) {
      this.props.onChange(value)
    }
    this.setState({
      value: newValue,
      dirtyValue: newValue,
    })
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
    let wdProps = {};
    if (this.props.wdKey) {
      wdProps = {
        "data-wd-key": this.props.wdKey
      };
    }

    if(
      this.props.hasOwnProperty("min") && this.props.hasOwnProperty("max") &&
      this.props.min !== undefined && this.props.max !== undefined &&
      this.props.allowRange
    ) {
      const value = this.state.value === undefined ? this.props.default : this.state.value;
      const rangeValue = Number.isNaN(parseFloat(value, 10)) ? this.props.default : value;

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
          onChange={this.onChangeRange}
          onPointerUp={() => {
            const {dirtyValue} = this.state;
            const hasChanged = this.state.props !== dirtyValue
            if(this.isValid(dirtyValue) && hasChanged) {
              this.setState({editing: false}, () => {
                this.props.onChange(dirtyValue);
              });
            }
          }}
        />
        <input
          key="text"
          spellCheck="false"
          className="maputnik-number"
          placeholder={this.props.default}
          value={this.state.dirtyValue}
          onChange={e => {
            this.changeValue(e.target.value)
          }}
          onBlur={this.resetValue}
          {...wdProps}
        />
      </div>
    }
    else {
      return <div className="maputnik-number-container">
        <input
          key="text"
          spellCheck="false"
          className="maputnik-number"
          placeholder={this.props.default}
          value={this.state.value}
          onChange={e => this.changeValue(e.target.value)}
          onBlur={this.resetValue}
          {...wdProps}
        />
      </div>
    }
  }
}

export default NumberInput
