import React from 'react'
import GlSpec from 'mapbox-gl-style-spec/reference/latest.js'

import input from '../../config/input.js'
import colors from '../../config/colors.js'
import { margins } from '../../config/scales.js'

import DocLabel from '../fields/DocLabel'
import Button from '../Button'
import SelectInput from '../inputs/SelectInput'
import StringInput from '../inputs/StringInput'
import AutocompleteInput from '../inputs/AutocompleteInput'

import AddIcon from 'react-icons/lib/md/add-circle-outline'
import DeleteIcon from 'react-icons/lib/md/delete'

const combiningFilterOps = ['all', 'any', 'none']
const setFilterOps = ['in', '!in']
const otherFilterOps = Object
  .keys(GlSpec.filter_operator.values)
  .filter(op => combiningFilterOps.indexOf(op) < 0)

function hasCombiningFilter(filter) {
  return combiningFilterOps.indexOf(filter[0]) >= 0
}

function hasNestedCombiningFilter(filter) {
  if(hasCombiningFilter(filter)) {
    const combinedFilters = filter.slice(1)
    return filter.slice(1).map(f => hasCombiningFilter(f)).filter(f => f == true).length > 0
  }
  return false
}

class CombiningOperatorSelect extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    style: React.PropTypes.object,
  }

  render() {
    const options = combiningFilterOps.map(op => {
      return <option key={op} value={op}>{op}</option>
    })

    return <div
      style={{
          marginTop: margins[1],
          marginBottom: margins[1],
          ...this.props.style
        }}
      >
      <select
        style={{
          ...input.select,
          width: '20.5%',
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
    return <SelectInput
      style={{
        width: '15%',
        margin: margins[0]
      }}
      value={this.props.value}
      onChange={this.props.onChange}
      options={otherFilterOps.map(op => [op, op])}
    />
  }
}

class SingleFilterEditor extends React.Component {
  static propTypes = {
    filter: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
    properties: React.PropTypes.object,
    style: React.PropTypes.object,
  }

  static defaultProps = {
    properties: {},
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

    return <div style={{
      marginTop: margins[1],
      marginBottom: margins[1],
      ...this.props.style
    }}>
      <AutocompleteInput
        wrapperStyle={{
          width: '30%',
          marginRight: margins[0]
        }}
        value={propertyName}
        options={Object.keys(this.props.properties).map(propName => [propName, propName])}
        onChange={newPropertyName => this.onFilterPartChanged(filterOp, newPropertyName, filterArgs)}
      />
      <OperatorSelect
        value={filterOp}
        onChange={newFilterOp => this.onFilterPartChanged(newFilterOp, propertyName, filterArgs)}
      />
      <StringInput
        style={{
          width: '50%',
          marginLeft: margins[0]
        }}
        value={filterArgs.join(',')}
        onChange={ v=> this.onFilterPartChanged(filterOp, propertyName, v.split(','))}
      />
    </div>
  }

}

export default class CombiningFilterEditor extends React.Component {
  static propTypes = {
    /** Properties of the vector layer and the available fields */
    properties: React.PropTypes.object.isRequired,
    filter: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired,
  }

  // Convert filter to combining filter
  combiningFilter() {
    let filter = this.props.filter || ['all']

    let combiningOp = filter[0]
    let filters = filter.slice(1)

    if(combiningFilterOps.indexOf(combiningOp) < 0) {
      combiningOp = 'all'
      filters = [filter.slice(0)]
    }

    return [combiningOp, ...filters]
  }

  onFilterPartChanged(filterIdx, newPart) {
    const newFilter = this.combiningFilter().slice(0)
    newFilter[filterIdx] = newPart
    this.props.onChange(newFilter)
  }

  deleteFilterItem(filterIdx) {
    const newFilter = this.combiningFilter().slice(0)
    console.log('Delete', filterIdx, newFilter)
    newFilter.splice(filterIdx + 1, 1)
    this.props.onChange(newFilter)
  }

  addFilterItem() {
    const newFilterItem = this.combiningFilter().slice(0)
    newFilterItem.push(['==', 'name', ''])
    this.props.onChange(newFilterItem)
  }

  render() {
    const filter = this.combiningFilter()
    let combiningOp = filter[0]
    let filters = filter.slice(1)

    const filterEditors = filters.map((f, idx) => {
      return <div>
        <Button
          style={{backgroundColor: null}}
          onClick={this.deleteFilterItem.bind(this, idx)}
        >
          <DeleteIcon />
        </Button>
        <SingleFilterEditor
          style={{
            display: 'inline-block',
            width: '80%'
          }}
          key={idx}
          properties={this.props.properties}
          filter={f}
          onChange={this.onFilterPartChanged.bind(this, idx + 1)}
        />
      </div>
    })

    //TODO: Implement support for nested filter
    if(hasNestedCombiningFilter(filter)) {
      return null
    }

    return <div>
      <DocLabel
        label={"Filter"}
        doc={GlSpec.layer.filter.doc}
        style={{
          width: '42.25%',
        }}
      />
      <CombiningOperatorSelect
        value={combiningOp}
        onChange={this.onFilterPartChanged.bind(this, 0)}
        style={{
          display: 'inline-block',
          width: '80%'
        }}
      />
      <Button onClick={this.addFilterItem.bind(this)}>Add filter</Button>
      {filterEditors}
    </div>
  }
}
