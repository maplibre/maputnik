import React from 'react'
import OperatorSelect from './OperatorSelect'

import { margins, fontSizes } from '../../config/scales.js'
import StringInput from '../inputs/StringInput'
import AutocompleteInput from '../inputs/AutocompleteInput'

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

export default SingleFilterEditor
