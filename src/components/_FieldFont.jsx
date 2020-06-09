import React from 'react'
import Block from './Block'
import PropTypes from 'prop-types'
import FieldAutocomplete from './FieldAutocomplete'

export default class FieldFont extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    default: PropTypes.array,
    fonts: PropTypes.array,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    fonts: []
  }

  get values() {
    const out = this.props.value || this.props.default || [];

    // Always put a "" in the last field to you can keep adding entries
    if (out[out.length-1] !== ""){
      return out.concat("");
    }
    else {
      return out;
    }
  }

  changeFont(idx, newValue) {
    const changedValues = this.values.slice(0)
    changedValues[idx] = newValue
    const filteredValues = changedValues
      .filter(v => v !== undefined)
      .filter(v => v !== "")

    this.props.onChange(filteredValues);
  }

  render() {
    const inputs = this.values.map((value, i) => {
      return <li
        key={i}
      >
        <FieldAutocomplete
          value={value}
          options={this.props.fonts.map(f => [f, f])}
          onChange={this.changeFont.bind(this, i)}
        />
      </li>
    })

    return <Block label={this.props.label}>
      <ul className="maputnik-font">
        {inputs}
      </ul>
    </Block>
  }
}

