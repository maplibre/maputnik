import React from 'react'

import { otherFilterOps } from '../../libs/filterops.js'
import StringInput from '../inputs/StringInput'
import AutocompleteInput from '../inputs/AutocompleteInput'
import SelectInput from '../inputs/SelectInput'

class SingleFilterEditor extends React.Component {
  static propTypes = {
    filter: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
    properties: React.PropTypes.object,
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

    return <div className="maputnik-filter-editor-single">
      <div className="maputnik-filter-editor-property">
        <AutocompleteInput
          value={propertyName}
          options={Object.keys(this.props.properties).map(propName => [propName, propName])}
          onChange={newPropertyName => this.onFilterPartChanged(filterOp, newPropertyName, filterArgs)}
        />
      </div>
      <div className="maputnik-filter-editor-operator">
        <SelectInput
          value={filterOp}
          onChange={newFilterOp => this.onFilterPartChanged(newFilterOp, propertyName, filterArgs)}
          options={otherFilterOps}
        />
      </div>
      <div className="maputnik-filter-editor-args">
        <StringInput
          value={filterArgs.join(',')}
          onChange={ v=> this.onFilterPartChanged(filterOp, propertyName, v.split(','))}
        />
      </div>
    </div>
  }

}

export default SingleFilterEditor
