import React from 'react'

import { margins, fontSizes } from '../../config/scales.js'
import { otherFilterOps } from '../../libs/filterops.js'
import StringInput from '../inputs/StringInput'
import AutocompleteInput from '../inputs/AutocompleteInput'
import SelectInput from '../inputs/SelectInput'

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
          width: '30%'
        }}
        value={propertyName}
        options={Object.keys(this.props.properties).map(propName => [propName, propName])}
        onChange={newPropertyName => this.onFilterPartChanged(filterOp, newPropertyName, filterArgs)}
      />
      <SelectInput
        style={{
          width: '19.5%',
          marginLeft: '2%'
        }}
        value={filterOp}
        onChange={newFilterOp => this.onFilterPartChanged(newFilterOp, propertyName, filterArgs)}
        options={otherFilterOps}
      />
      <StringInput
        style={{
          width: '47%',
          marginLeft: '1.5%'
        }}
        value={filterArgs.join(',')}
        onChange={ v=> this.onFilterPartChanged(filterOp, propertyName, v.split(','))}
      />
    </div>
  }

}

export default SingleFilterEditor
