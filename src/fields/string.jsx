import React from 'react'
import inputStyle from './input.js'

/*** Number fields with support for min, max and units and documentation*/
class StringField extends React.Component {
static propTypes = {
    onChange: React.PropTypes.func.isRequired,
		name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    default: React.PropTypes.number,
    doc: React.PropTypes.string,
  }

	onChange(e) {
		return this.props.onChange(e.target.value)
	}

render() {
	return <div style={inputStyle.property}>
			<label style={inputStyle.label}>{this.props.name}</label>
			<input
				style={inputStyle.input}
				name={this.props.name}
				placeholder={this.props.default}
				value={this.props.value}
				onChange={this.onChange.bind(this)}
			/>
		</div>
	}
}

export default StringField
