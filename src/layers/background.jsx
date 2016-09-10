import React from 'react'
import { Input } from 'rebass'

export default class BackgroundLayer extends React.Component {
	static propTypes = {
		layer: React.PropTypes.object.isRequired,
		onPaintChanged: React.PropTypes.func.isRequired
	}

	onPaintChanged(property, e) {
		let value = e.target.value
		if (property == "background-opacity" && !isNaN(parseFloat(value))) {
			value = parseFloat(value)
		}
		this.props.onPaintChanged(property, value)
	}

	render() {
		const paint = this.props.layer.get('paint')
		return <div>
			<Input name="background-color" label="Background color" onChange={this.onPaintChanged.bind(this, "background-color")} value={paint.get("background-color")} />
			<Input name="background-opacity" label="Background opacity" onChange={this.onPaintChanged.bind(this, "background-opacity")} value={paint.get("background-opacity")} />
		</div>
	}
}

