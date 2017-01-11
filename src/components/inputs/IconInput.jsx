import React from 'react'
import AutocompleteInput from './AutocompleteInput'


class IconInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.array,
    icons: React.PropTypes.array,
    style: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
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
