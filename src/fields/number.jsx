import React from 'react'
import { Select, Input } from 'rebass'

/*** Number fields with support for min, max and units and documentation*/
class NumberField extends React.Component {
	static propTypes = {
    onChange: React.PropTypes.func.isRequired,
		name: React.PropTypes.string.isRequired,
    value: React.PropTypes.number,
    default: React.PropTypes.number,
    unit: React.PropTypes.string,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    doc: React.PropTypes.string,
  }

	render() {
		return <Input type="number"
			onChange={this.props.onChange}
			label={this.props.name}
			name={this.props.name}
			message={this.props.doc}
		/>
	}
}

export default NumberField
