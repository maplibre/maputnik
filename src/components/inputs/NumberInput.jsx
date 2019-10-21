import React from 'react'
import PropTypes from 'prop-types'

class NumberInput extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    default: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func,
    required: PropTypes.bool,
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
    return {};
  }

  changeValue(newValue) {
    this.setState({editing: true});
    const value = (newValue === "" || newValue === undefined) ?
      undefined :
      parseFloat(newValue);

    const hasChanged = this.state.value !== value
    if(this.isValid(value) && hasChanged) {
      this.props.onChange(value)
    }
    this.setState({ value: newValue })
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

  render() {
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

export default NumberInput
