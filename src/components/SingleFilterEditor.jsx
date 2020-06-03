import React from 'react'
import PropTypes from 'prop-types'

import { otherFilterOps } from '../libs/filterops.js'
import FieldString from './FieldString'
import FieldAutocomplete from './FieldAutocomplete'
import FieldSelect from './FieldSelect'

function tryParseInt(v) {
  if (v === '') return v
  if (isNaN(v)) return v
  return parseFloat(v)
}

function tryParseBool(v) {
  const isString = (typeof(v) === "string");
  if(!isString) {
    return v;
  }

  if(v.match(/^\s*true\s*$/)) {
    return true;
  }
  else if(v.match(/^\s*false\s*$/)) {
    return false;
  }
  else {
    return v;
  }
}

function parseFilter(v) {
  v = tryParseInt(v);
  v = tryParseBool(v);
  return v;
}

export default class SingleFilterEditor extends React.Component {
  static propTypes = {
    filter: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    properties: PropTypes.object,
  }

  static defaultProps = {
    properties: {},
  }

  onFilterPartChanged(filterOp, propertyName, filterArgs) {
    let newFilter = [filterOp, propertyName, ...filterArgs.map(parseFilter)]
    if(filterOp === 'has' || filterOp === '!has') {
      newFilter = [filterOp, propertyName]
    } else if(filterArgs.length === 0) {
      newFilter = [filterOp, propertyName, '']
    }
    this.props.onChange(newFilter)
  }

  render() {
    const f = this.props.filter
    const filterOp = f[0]
    const propertyName = f[1]
    const filterArgs = f.slice(2)

    return <div className="maputnik-filter-editor-single">
      <div className="maputnik-filter-editor-property">
        <FieldAutocomplete
          value={propertyName}
          options={Object.keys(this.props.properties).map(propName => [propName, propName])}
          onChange={newPropertyName => this.onFilterPartChanged(filterOp, newPropertyName, filterArgs)}
        />
      </div>
      <div className="maputnik-filter-editor-operator">
        <FieldSelect
          value={filterOp}
          onChange={newFilterOp => this.onFilterPartChanged(newFilterOp, propertyName, filterArgs)}
          options={otherFilterOps}
        />
      </div>
      {filterArgs.length > 0 &&
      <div className="maputnik-filter-editor-args">
        <FieldString
          value={filterArgs.join(',')}
          onChange={ v=> this.onFilterPartChanged(filterOp, propertyName, v.split(','))}
        />
      </div>
      }
    </div>
  }

}

