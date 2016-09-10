import React from 'react'
import Immutable from 'immutable'
import spec from 'mapbox-gl-style-spec/reference/latest.min.js'
import EnumField from '../fields/enum.jsx'

export default class LineLayer extends React.Component {
	static propTypes = {
		layer: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  }

	render() {
		const enumFieldFromType = (key, field) => {
				if(field.type === 'enum') {
					return <EnumField
						key={key}
						name={key}
						values={field.values}
						value={this.props.layer.getIn(['layout', key], field.default)}
						doc={field.doc}/>
				}
		}

		const layoutLineFields = () => {
			const type = spec["layout_line"]
			return Object.keys(type).map(key => {
				return enumFieldFromType(key, type[key])
			})
		}

		const paintLineFields = () => {
			const type = spec["paint_line"]
			return Object.keys(type).map(key => {
				return enumFieldFromType(key, type[key])
			})
		}

		return <div>{layoutLineFields()}{paintLineFields()}</div>
	}
}
