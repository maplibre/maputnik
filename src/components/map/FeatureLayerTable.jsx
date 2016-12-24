import React from 'react'

class FeatureLayerTable extends React.Component {
  render() {
    const feature = this.props.feature
    const rows = <tr>
      <td className="debug-prop-key">{feature.layer.id}</td>
    </tr>
    return <table
      style={{
        color: 'black',
      }}
      className="debug-props">
      <tbody>{rows}</tbody>
    </table>;;
  }
}


export default FeatureLayerTable
