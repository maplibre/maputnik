import React from 'react'
import { Label, Input } from 'rebass'
import {inputBase} from '../theme'

/*** Number fields with support for min, max and units and documentation*/
class ColorField extends React.Component {
static propTypes = {
    onChange: React.PropTypes.func.isRequired,
		name: React.PropTypes.string.isRequired,
    value: React.PropTypes.number,
    default: React.PropTypes.number,
    doc: React.PropTypes.string,
  }

	onChange(e) {
		return this.props.onChange(e.target.value)
	}

	render() {
		return <div>
			<Label htmlFor={this.props.name} children={this.props.name} />
			<input
				style={inputBase}
				name={this.props.name}
				placeholder={this.props.default}
				value={this.props.value}
				onChange={this.onChange.bind(this)}
			/>
		</div>
	}
}

export default ColorField
