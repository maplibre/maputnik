import React from 'react'
import { Select, Input } from 'rebass'

class EnumField extends React.Component {
	static propTypes = {
		name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    allowedValues: React.PropTypes.array.isRequired,
    doc: React.PropTypes.string,
  }

	render() {
		const options = this.props.allowedValues.map(val => {
			return {children: val, value: val}
		})
		return <Select name={this.props.name} options={options} label={this.props.name} />
	}
}

export default EnumField
