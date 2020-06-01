import React from 'react'
import PropTypes from 'prop-types'
import FieldAutocomplete from './FieldAutocomplete'


export default class FieldSymbol extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    icons: PropTypes.array,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    icons: []
  }

  render() {
    return <FieldAutocomplete
      value={this.props.value}
      options={this.props.icons.map(f => [f, f])}
      onChange={this.props.onChange}
      wrapperStyle={this.props.style}
    />
  }
}

