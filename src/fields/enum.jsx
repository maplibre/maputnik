import React from 'react'
import { Select, Input } from 'rebass'

export default class EnumField extends React.Component {
	static propTypes = {
		name: React.PropTypes.string.isRequired,
    values: React.PropTypes.array.isRequired,
    value: React.PropTypes.string.isRequired,
    doc: React.PropTypes.string,
  }

	render() {
		const options = this.props.values.map(val => {
			return {children: val, value: val}
		})
		return <Select name={this.props.name} options={options} label={this.props.name} />
	}
}
