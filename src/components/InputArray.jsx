import React from 'react'
import PropTypes from 'prop-types'
import InputString from './InputString'
import InputNumber from './InputNumber'

export default class FieldArray extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    type: PropTypes.string,
    length: PropTypes.number,
    default: PropTypes.array,
    onChange: PropTypes.func,
    'aria-label': PropTypes.string,
  }

  static defaultProps = {
    value: [],
    default: [],
  }

  constructor (props) {
    super(props);
    this.state = {
      value: this.props.value.slice(0),
      // This is so we can compare changes in getDerivedStateFromProps
      initialPropsValue: this.props.value.slice(0),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const value = [];
    const initialPropsValue = state.initialPropsValue.slice(0);

    Array(props.length).fill(null).map((_, i) => {
      if (props.value[i] === state.initialPropsValue[i]) {
        value[i] = state.value[i];
      }
      else {
        value[i] = state.value[i];
        initialPropsValue[i] = state.value[i];
      }
    })

    return {
      value,
      initialPropsValue,
    };
  }

  isComplete (value) {
    return Array(this.props.length).fill(null).every((_, i) => {
      const val = value[i]
      return !(val === undefined || val === "");
    });
  }

  changeValue(idx, newValue) {
    const value = this.state.value.slice(0);
    value[idx] = newValue;

    this.setState({
      value,
    }, () => {
      if (this.isComplete(value)) {
        this.props.onChange(value);
      }
      else {
        // Unset until complete
        this.props.onChange(undefined);
      }
    });
  }

  render() {
    const {value} = this.state;

    const containsValues = (
      value.length > 0 &&
      !value.every(val => {
        return (val === "" || val === undefined)
      })
    );

    const inputs = Array(this.props.length).fill(null).map((_, i) => {
      if(this.props.type === 'number') {
        return <InputNumber
          key={i}
          default={containsValues ? undefined : this.props.default[i]}
          value={value[i]}
          required={containsValues ? true : false}
          onChange={this.changeValue.bind(this, i)}
          aria-label={this.props['aria-label'] || this.props.label}
        />
      } else {
        return <InputString
          key={i}
          default={containsValues ? undefined : this.props.default[i]}
          value={value[i]}
          required={containsValues ? true : false}
          onChange={this.changeValue.bind(this, i)}
          aria-label={this.props['aria-label'] || this.props.label}
        />
      }
    })

    return (
      <div className="maputnik-array">
        {inputs}
      </div>
    )
  }
}

