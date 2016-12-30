import React from 'react'
import SelectInput from './SelectInput'
import input from '../../config/input.js'

//TODO: Query available font stack dynamically
import fontStacks from '../../config/fontstacks.json'

class FontInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.array.isRequired,
    style: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
  }

  get values() {
   return this.props.value || this.props.default.slice(1) || []
  }

  changeFont(idx, newValue) {
    const changedValues = this.values.slice(0)
    changedValues[idx] = newValue
    this.props.onChange(changedValues)
  }

  render() {
    const inputs = this.values.map((value, i) => {
      return <SelectInput
        key={i}
        style={{
          width: '100%',
          ...this.props.style,
        }}
        value={value}
        options={fontStacks.map(f => [f, f])}
        onChange={this.changeFont.bind(this, i)}
      />
    })

    return <div style={{display: 'inline-block', width: '51%'}}>
      {inputs}
    </div>
  }
}

export default FontInput
