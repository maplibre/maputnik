import React from 'react'
import PropTypes from 'prop-types'
import { combiningFilterOps } from '../../libs/filterops.js'

import {latest} from '@mapbox/mapbox-gl-style-spec'
import DocLabel from '../fields/DocLabel'
import SelectInput from '../inputs/SelectInput'
import SingleFilterEditor from './SingleFilterEditor'
import FilterEditorBlock from './FilterEditorBlock'
import Button from '../Button'

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
    properties: PropTypes.object,
    filter: PropTypes.array,
    onChange: PropTypes.func.isRequired,
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

  addFilterItem = () => {
    const newFilterItem = this.combiningFilter().slice(0)
    newFilterItem.push(['==', 'name', ''])
    this.props.onChange(newFilterItem)
  }

  render() {
    const filter = this.combiningFilter()
    let combiningOp = filter[0]
    let filters = filter.slice(1)

    const editorBlocks = filters.map((f, idx) => {
      return <FilterEditorBlock key={idx} onDelete={this.deleteFilterItem.bind(this, idx)}>
        <SingleFilterEditor
          properties={this.props.properties}
          filter={f}
          onChange={this.onFilterPartChanged.bind(this, idx + 1)}
        />
      </FilterEditorBlock>
    })

    //TODO: Implement support for nested filter
    if(hasNestedCombiningFilter(filter)) {
      return <div className="maputnik-filter-editor-unsupported">
        Nested filters are not supported.
      </div>
    }

    return <div className="maputnik-filter-editor">
      <div className="maputnik-filter-editor-compound-select" data-wd-key="layer-filter">
        <DocLabel
          label={"Compound Filter"}
          doc={latest.layer.filter.doc + " Combine multiple filters together by using a compound filter."}
        />
        <SelectInput
          value={combiningOp}
          onChange={this.onFilterPartChanged.bind(this, 0)}
          options={[["all", "every filter matches"], ["none", "no filter matches"], ["any", "any filter matches"]]}
        />
      </div>
      {editorBlocks}
      <div className="maputnik-filter-editor-add-wrapper">
        <Button
          data-wd-key="layer-filter-button"
          className="maputnik-add-filter"
          onClick={this.addFilterItem}>
          Add filter
        </Button>
      </div>
    </div>
  }
}
