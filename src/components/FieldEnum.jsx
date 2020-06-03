import React from 'react'
import PropTypes from 'prop-types'
import FieldSelect from './FieldSelect'
import FieldMultiInput from './FieldMultiInput'


function optionsLabelLength(options) {
  let sum = 0;
  options.forEach(([_, label]) => {
    sum += label.length
  })
  return sum
}


export default class FieldEnum extends React.Component {
  static propTypes = {
    "data-wd-key": PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.object,
    default: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
  }

  render() {
    const {options, value, onChange, name} = this.props;

    if(options.length <= 3 && optionsLabelLength(options) <= 20) {
      return <FieldMultiInput
        name={name}
        options={options}
        value={value || this.props.default}
        onChange={onChange}
      />
    } else {
      return <FieldSelect
        options={options}
        value={value || this.props.default}
        onChange={onChange}
      />
    }
  }
}
