import React from 'react'

import input from '../../config/input.js'
import colors from '../../config/colors.js'
import { margins, fontSizes } from '../../config/scales.js'
import { combiningFilterOps } from '../../libs/filterops.js'

import GlSpec from 'mapbox-gl-style-spec/reference/latest.js'
import DocLabel from '../fields/DocLabel'
import SelectInput from '../inputs/SelectInput'
import SingleFilterEditor from './SingleFilterEditor'
import FilterEditorBlock from './FilterEditorBlock'
import Button from '../Button'

import DeleteIcon from 'react-icons/lib/md/delete'
import AddIcon from 'react-icons/lib/fa/plus'

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

    const editorBlocks = filters.map((f, idx) => {
      return <FilterEditorBlock onDelete={this.deleteFilterItem.bind(this, idx)}>
        <SingleFilterEditor
          key={idx}
          properties={this.props.properties}
          filter={f}
          onChange={this.onFilterPartChanged.bind(this, idx + 1)}
        />
      </FilterEditorBlock>
    })

    //TODO: Implement support for nested filter
    if(hasNestedCombiningFilter(filter)) {
      return null
    }

    return <div>
      <div style={{ marginBottom: margins[2] }}>
        <DocLabel
          label={"Compound Filter"}
          doc={GlSpec.layer.filter.doc + " Combine multiple filters together by using a compound filter."}
          style={{
            display: 'inline-block',
            width: '30%',
          }}
        />
        <Button onClick={this.addFilterItem.bind(this)} style={{
          display: 'inline-block',
          width: '18%',
          marginRight: '2%',
        }}>
          Add filter
        </Button>
        <SelectInput
          value={combiningOp}
          onChange={this.onFilterPartChanged.bind(this, 0)}
          options={[["all", "every filter matches"], ["none", "no filter matches"], ["any", "any filter matches"]]}
          style={{
            display: 'inline-block',
            width: '50%',
          }}
        />
      </div>
      {editorBlocks}
    </div>
  }
}
