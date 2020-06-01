import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Button from './Button'

export default class FieldMultiInput extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    let options = this.props.options
    if(options.length > 0 && !Array.isArray(options[0])) {
      options = options.map(v => [v, v])
    }

    const selectedValue = this.props.value || options[0][0]
    const radios = options.map(([val, label])=> {
      return <label
        key={val}
        className={classnames("maputnik-radio-as-button", {"maputnik-button-selected": val === selectedValue})}
      >
        <input type="radio"
          name={this.props.name}
          onChange={e => this.props.onChange(val)}
          value={val}
          checked={val === selectedValue}
        />
        {label}
      </label>
    })

    return <fieldset className="maputnik-multibutton">
      {radios}
    </fieldset>
  }
}

