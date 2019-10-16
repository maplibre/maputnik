import React from 'react'
import PropTypes from 'prop-types'
import StringInput from './StringInput'
import NumberInput from './NumberInput'

class ArrayInput extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    type: PropTypes.string,
    length: PropTypes.number,
    default: PropTypes.array,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: [],
    default: [],
  }

  changeValue(idx, newValue) {
    console.log(idx, newValue)
    const values = this.props.value.slice(0)
    values[idx] = newValue
    this.props.onChange(values)
  }

  render() {
    const inputs = Array(this.props.length).fill(null).map((_, i) => {
      if(this.props.type === 'number') {
        return <NumberInput
          key={i}
          default={this.props.default[i]}
          value={this.props.value[i]}
          onChange={this.changeValue.bind(this, i)}
        />
      } else {
        return <StringInput
          key={i}
          default={this.props.default[i]}
          value={this.props.value[i]}
          onChange={this.changeValue.bind(this, i)}
        />
      }
    })

    return <div className="maputnik-array">
      {inputs}
    </div>
  }
}

export default ArrayInput
