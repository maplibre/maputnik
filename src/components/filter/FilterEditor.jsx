import React from 'react'
import GlSpec from 'mapbox-gl-style-spec/reference/latest.js'

import input from '../../config/input.js'
import colors from '../../config/colors.js'
import { margins, fontSizes } from '../../config/scales.js'
import { combiningFilterOps } from '../../libs/filterops.js'

import OperatorSelect from './OperatorSelect'
import SingleFilterEditor from './SingleFilterEditor'
import CombiningOperatorSelect from './CombiningOperatorSelect'
import DocLabel from '../fields/DocLabel'
import Button from '../Button'

import AddIcon from 'react-icons/lib/md/add-circle-outline'
import DeleteIcon from 'react-icons/lib/md/delete'

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
        <div style={{display: 'inline-block', width: '25%'}}>
          <Button
            style={{backgroundColor: null}}
            onClick={this.deleteFilterItem.bind(this, idx)}
          >
            <DeleteIcon />
          </Button>
        </div>
        <SingleFilterEditor
          style={{
            display: 'inline-block',
            width: '75%'
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
      <div style={{
        width: '50%',
        verticalAlign: 'top',
        display: 'inline-block',
      }}>
        <DocLabel
          label={"Filter"}
          doc={GlSpec.layer.filter.doc}
          style={{
            display: 'block',
          }}
        />
        <div>
          <Button onClick={this.addFilterItem.bind(this)}>Add filter</Button>
        </div>
      </div>
      <CombiningOperatorSelect
        value={combiningOp}
        onChange={this.onFilterPartChanged.bind(this, 0)}
        style={{
          display: 'inline-block',
          width: '50%'
        }}
      />
      {filterEditors}
    </div>
  }
}
