import React from 'react'
import input from '../../config/input.js'

class StringInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    style: React.PropTypes.object,
    default: React.PropTypes.string,
    onChange: React.PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || ''
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value || '' })
  }

  render() {
    return <input
      className="maputnik-string"
      style={this.props.style}
      value={this.state.value}
      placeholder={this.props.default}
      onChange={e => this.setState({ value: e.target.value })}
      onBlur={() => {
        if(this.state.value) this.props.onChange(this.state.value)
      }}
    />
  }
}

export default StringInput
