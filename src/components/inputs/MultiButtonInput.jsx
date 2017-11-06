import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Button from '../Button'

class MultiButtonInput extends React.Component {
  static propTypes = {
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
    const buttons = options.map(([val, label])=> {
      return <Button
        key={val}
        onClick={e => this.props.onChange(val)}
        className={classnames({"maputnik-button-selected": val === selectedValue})}
      >
        {label}
      </Button>
    })

    return <div className="maputnik-multibutton">
      {buttons}
    </div>
  }
}

export default MultiButtonInput
