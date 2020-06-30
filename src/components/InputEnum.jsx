import React from 'react'
import PropTypes from 'prop-types'
import InputSelect from './InputSelect'
import InputMultiInput from './InputMultiInput'


function optionsLabelLength(options) {
  let sum = 0;
  options.forEach(([_, label]) => {
    sum += label.length
  })
  return sum
}


export default class InputEnum extends React.Component {
  static propTypes = {
    "data-wd-key": PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.object,
    default: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
    'aria-label': PropTypes.string,
  }

  render() {
    const {options, value, onChange, name, label} = this.props;

    if(options.length <= 3 && optionsLabelLength(options) <= 20) {
      return <InputMultiInput
        name={name}
        options={options}
        value={value || this.props.default}
        onChange={onChange}
        aria-label={this.props['aria-label'] || label}
      />
    } else {
      return <InputSelect
        options={options}
        value={value || this.props.default}
        onChange={onChange}
        aria-label={this.props['aria-label'] || label}
      />
    }
  }
}

