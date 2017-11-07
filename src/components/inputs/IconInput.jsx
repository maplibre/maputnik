import React from 'react'
import PropTypes from 'prop-types'
import AutocompleteInput from './AutocompleteInput'


class IconInput extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    icons: PropTypes.array,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    icons: []
  }

  render() {
    return <AutocompleteInput
      value={this.props.value}
      options={this.props.icons.map(f => [f, f])}
      onChange={this.props.onChange}
      wrapperStyle={this.props.style}
    />
  }
}

export default IconInput
