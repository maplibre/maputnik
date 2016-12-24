import React from 'react'


function items(object) {
    let arr = [];
    for (var key in object) {
        arr.push({ key, value: object[key] });
    }
    return arr;
}


function displayValue(value) {
    if (typeof value === "undefined" || value === null) return value;
    if (value instanceof Date) return value.toLocaleString();
    if (typeof value === "object" ||
        typeof value === "number" ||
        typeof value === "string") return value.toString();
    return value;
}

class FeaturePropertyTable extends React.Component {
    render() {
    const rows = items(this.props.feature.properties)
      .map(i => {
        return <tr key={i.key} className="debug-prop">
        <td className="debug-prop-key">{i.key}</td>
        <td className="debug-prop-value">{displayValue(i.value)}</td>
        </tr>;
      });
    return <table
      style={{
        color: 'black',
      }}
      className="debug-props">
      <tbody>{rows}</tbody>
    </table>;;
  }
}


export default FeaturePropertyTable
