import React from 'react'
import Immutable from 'immutable'
import { PropertyGroup } from '../fields/spec'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import GlSpec from 'mapbox-gl-style-spec/reference/latest.min.js'
import inputStyle from '../fields/input.js'
import theme from '../theme.js'

const combiningFilterOps = ['all', 'any', 'none']
const otherFilterOps = Object
  .keys(GlSpec.filter_operator.values)
  .filter(op => combiningFilterOps.indexOf(op) < 0)

class CombiningOperatorSelect extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    const options = combiningFilterOps.map(op => {
      return <option key={op} value={op}>{op}</option>
    })

    return <div>
      <select
        style={{
          ...inputStyle.select,
          width: '20.5%',
          margin: theme.scale[0],
        }}
        value={this.props.value}
        onChange={e => this.props.onChange(e.target.value)}
      >
        {options}
      </select>
      <label style={{
        ...inputStyle.label,
        width: '60%',
        marginLeft: theme.scale[0],
      }}>
        of the filters matches
      </label>
    </div>
  }
}

class OperatorSelect extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    const options = otherFilterOps.map(op => {
      return <option key={op} value={op}>{op}</option>
    })
    return <select
      style={{
        ...inputStyle.select,
        width: '15%',
        margin: theme.scale[0]
      }}
      value={this.props.value}
      onChange={e => this.props.onChange(e.target.value)}
    >
      {options}
    </select>
  }
}

class SingleFilterEditor extends React.Component {
  static propTypes = {
    filter: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  onFilterPartChanged(filterOp, propertyName, filterArgs) {
    const newFilter = [filterOp, propertyName, ...filterArgs]
    this.props.onChange(newFilter)
  }

  render() {
    const f = this.props.filter
    const filterOp = f[0]
    const propertyName = f[1]
    const filterArgs = f.slice(2)

    return <div>
      <input
        style={{
          ...inputStyle.input,
            width: '17%',
            margin: theme.scale[0]
        }}
        value={propertyName}
        onChange={newPropertyName => this.onFilterPartChanged(filterOp, newPropertyName, filterArgs)}
      />
      <OperatorSelect
        value={filterOp}
        onChange={newFilterOp => this.onFilterPartChanged(newFilterOp, propertyName, filterArgs)}
      />
      <input
        style={{
          ...inputStyle.input,
          width: '53%',
          margin: theme.scale[0]
        }}
        value={filterArgs}
        onChange={newFilterArgs => this.onFilterPartChanged(filterOp, propertyName, newFilterArgs)}
      />
    </div>
  }

}

export default class CombiningFilterEditor extends React.Component {
  static propTypes = {
    filter: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  // Convert filter to combining filter
  combiningFilter() {
    let combiningOp = this.props.filter[0]
    let filters = this.props.filter.slice(1)

    if(combiningFilterOps.indexOf(combiningOp) < 0) {
      combiningOp = 'all'
      filters = [this.props.filter.slice(0)]
    }

    return [combiningOp, ...filters]
  }

  onFilterPartChanged(filterIdx, newPart) {
    const newFilter = this.combiningFilter().slice(0)
    newFilter[filterIdx] = newPart
    this.props.onChange(newFilter)
  }

  render() {
    const filter = this.combiningFilter()
    let combiningOp = filter[0]
    let filters = filter.slice(1)

    const filterEditors = filters.map((f, idx) => {
      return <SingleFilterEditor
        key={idx}
        filter={f}
        onChange={this.onFilterPartChanged.bind(this, idx + 1)}
      />
    })

    return <div style={{
      padding: theme.scale[2],
      paddingRight: 0,
      backgroundColor: theme.colors.black
    }}>
      <CombiningOperatorSelect
        value={combiningOp}
        onChange={this.onFilterPartChanged.bind(this, 0)}
      />
      {filterEditors}
    </div>
  }
}
