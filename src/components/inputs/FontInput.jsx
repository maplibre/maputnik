import React from 'react'
import AutocompleteInput from './AutocompleteInput'
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
      return <AutocompleteInput
        key={i}
        value={value}
        options={fontStacks.map(f => [f, f])}
        onChange={this.changeFont.bind(this, i)}
      />
    })

    return <div style={{display: 'inline-block'}}>
      {inputs}
    </div>
  }
}

export default FontInput
