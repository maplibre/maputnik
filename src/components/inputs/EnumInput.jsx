import React from 'react'
import PropTypes from 'prop-types'
import SelectInput from '../inputs/SelectInput'
import MultiButtonInput from '../inputs/MultiButtonInput'


function optionsLabelLength(options) {
  let sum = 0;
  options.forEach(([_, label]) => {
    sum += label.length
  })
  return sum
}


class EnumInput extends React.Component {
  static propTypes = {
    "data-wd-key": PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.object,
    default: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
  }

  render() {
    const {options, value, onChange} = this.props;

    if(options.length <= 3 && optionsLabelLength(options) <= 20) {
      return <MultiButtonInput
        options={options}
        value={value || this.props.default}
        onChange={onChange}
      />
    } else {
      return <SelectInput
        options={options}
        value={value || this.props.default}
        onChange={onChange}
      />
    }
  }
}

export default EnumInput
