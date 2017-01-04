import React from 'react'
import input from '../../config/input.js'

class StringInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    style: React.PropTypes.object,
    default: React.PropTypes.number,
    onChange: React.PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  changeValue(newValue) {
    //TODO: In feature we can try to do validation here as well
    this.setState({ value: newValue })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value })
  }

  render() {
    return <input
      style={{
        ...input.input,
        ...this.props.style
      }}
      value={this.state.value}
      placeholder={this.props.default}
      onChange={e => this.changeValue(e.target.value)}
      onBlur={() => this.props.onChange(this.state.value)}
    />
  }
}

export default StringInput
