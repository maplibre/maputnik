import React from 'react'
import { Checkbox, Input } from 'rebass'
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class FillLayer extends React.Component {
	static propTypes = {
    layer: React.PropTypes.object.isRequired,
    onPaintChanged: React.PropTypes.func.isRequired
  }

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	onPaintChanged(property, e) {
		let value = e.target.value
		if (property == "fill-opacity") {
			value = parseFloat(value)
		}

		this.props.onPaintChanged(property, value)
	}

	render() {
		const paint = this.props.layer.get('paint')
		return <div>
			<Input name="fill-color" label="Fill color" onChange={this.onPaintChanged.bind(this, "fill-color")} value={paint.get("fill-color")} />
			<Input name="fill-outline-color" label="Fill outline color" onChange={this.onPaintChanged.bind(this, "fill-outline-color")} value={paint.get("fill-outline-color")} />
			<Input name="fill-translate" label="Fill translate" onChange={this.onPaintChanged.bind(this, "fill-translate")} value={paint.get("fill-translate")} />
			<Input name="fill-translate-anchor" label="Fill translate anchor" onChange={this.onPaintChanged.bind(this, "fill-translate-anchor")} value={paint.get("fill-translate-anchor")} />
			<Checkbox name="fill-antialias" label="Antialias" onChange={this.onPaintChanged.bind(this, "fill-antialias")} checked={paint.get("fill-antialias")} />
			<Input name="fill-opacity" label="Opacity" onChange={this.onPaintChanged.bind(this, "fill-opacity")} value={paint.get("fill-opacity")} />
		</div>
	}
}
