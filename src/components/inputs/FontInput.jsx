import React from 'react'
import AutocompleteInput from './AutocompleteInput'

//TODO: Query available font stack dynamically
import fontStacks from '../../config/fontstacks.json'

class FontInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.array.isRequired,
    fonts: React.PropTypes.array,
    style: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    fonts: []
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
        options={this.props.fonts.map(f => [f, f])}
        onChange={this.changeFont.bind(this, i)}
      />
    })

    return <div className="maputnik-font">
      {inputs}
    </div>
  }
}

export default FontInput
