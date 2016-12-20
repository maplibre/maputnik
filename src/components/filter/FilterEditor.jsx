import React from 'react'
import Immutable from 'immutable'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import GlSpec from 'mapbox-gl-style-spec/reference/latest.min.js'

import input from '../../config/input.js'
import colors from '../../config/colors.js'
import { margins } from '../../config/scales.js'

const combiningFilterOps = ['all', 'any', 'none']
const setFilterOps = ['in', '!in']
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
          ...input.select,
          width: '20.5%',
          margin: margins[0],
        }}
        value={this.props.value}
        onChange={e => this.props.onChange(e.target.value)}
      >
        {options}
      </select>
      <label style={{
        ...input.label,
        width: '60%',
        marginLeft: margins[0],
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
        ...input.select,
        width: '15%',
        margin: margins[0]
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
    properties: React.PropTypes.instanceOf(Immutable.Map),
  }

  static defaultProps = {
    properties: Immutable.Map(),
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
      <select
        style={{
          ...input.select,
            width: '17%',
            margin: margins[0]
        }}
        value={propertyName}
        onChange={newPropertyName => this.onFilterPartChanged(filterOp, newPropertyName, filterArgs)}
      >
        {this.props.properties.keySeq().map(propName => {
          return <option key={propName} value={propName}>{propName}</option>
        }).toIndexedSeq()}
      </select>
      <OperatorSelect
        value={filterOp}
        onChange={newFilterOp => this.onFilterPartChanged(newFilterOp, propertyName, filterArgs)}
      />
      <input
        style={{
          ...input.input,
          width: '53%',
          margin: margins[0]
        }}
        value={filterArgs.join(',')}
        onChange={e => {
          this.onFilterPartChanged(filterOp, propertyName, e.target.value.split(','))}}
      />
    </div>
  }

}

export default class CombiningFilterEditor extends React.Component {
  static propTypes = {
    /** Properties of the vector layer and the available fields */
    properties: React.PropTypes.instanceOf(Immutable.Map).isRequired,
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
        properties={this.props.properties}
        filter={f}
        onChange={this.onFilterPartChanged.bind(this, idx + 1)}
      />
    })

    return <div style={{
      padding: margins[2],
      paddingRight: 0,
      backgroundColor: colors.black
    }}>
      <CombiningOperatorSelect
        value={combiningOp}
        onChange={this.onFilterPartChanged.bind(this, 0)}
      />
      {filterEditors}
    </div>
  }
}
