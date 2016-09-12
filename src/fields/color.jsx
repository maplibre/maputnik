import React from 'react'
import { Select, Input } from 'rebass'

/*** Number fields with support for min, max and units and documentation*/
class ColorField extends React.Component {
static propTypes = {
		name: React.PropTypes.string.isRequired,
    value: React.PropTypes.number,
    default: React.PropTypes.number,
    doc: React.PropTypes.string,
  }

	render() {
		return <Input
			label={this.props.name}
			name={this.props.name}
		/>
	}
}

export default ColorField
