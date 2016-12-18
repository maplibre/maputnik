import React from 'react'
import Immutable from 'immutable'
import { PropertyGroup } from '../fields/spec'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import inputStyle from '../fields/input.js'
import GlSpec from 'mapbox-gl-style-spec/reference/latest.min.js'

export default class FilterEditor extends React.Component {
  static propTypes = {
    filter: React.PropTypes.array.isRequired,
    onFilterChanged: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const op = this.props.filter[0]
    const filters = this.props.filter.slice(1)
    const filterElems = filters.map(f => {
      const filterOp = f[0]
      const prop = f[1]
      const args = f.slice(2)

      const availableFilterOperators = GlSpec.filter_operator.values
      const filterOpOptions = availableFilterOperators.map(value => {
        return <option value={value}>{value}</option>
      })

      return <div>
        <select
          style={{...inputStyle.select, width: '15%'}}
          value={filterOp}
        >
          {filterOpOptions}
        </select>
        <input
          style={{...inputStyle.input, width: '17%'}}
          value={prop}
        />
        <input
          style={{...inputStyle.input, width: '55%'}}
          value={args}
        />
      </div>
    })

    return <div>
      <select
        style={{...inputStyle.select, width: '15%'}}
        value={op}
      >
        <option value={"all"}>all</option>
        <option value={"any"}>any</option>
      </select>
      <br/>
      {filterElems}
    </div>
  }
}
