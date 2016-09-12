import React from 'react'
import { Select, Input } from 'rebass'

class EnumField extends React.Component {
	static propTypes = {
    onChange: React.PropTypes.func.isRequired,
		name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    allowedValues: React.PropTypes.array.isRequired,
    doc: React.PropTypes.string,
  }

	onChange(e) {
		return this.props.onChange(e.target.value)
	}

	render() {
		const options = this.props.allowedValues.map(val => {
			return {children: val, value: val}
		})
		return <Select
			onChange={this.onChange.bind(this)}
			name={this.props.name}
			options={options}
			label={this.props.name}
		/>
	}
}

export default EnumField
