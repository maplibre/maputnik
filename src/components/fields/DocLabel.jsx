import React from 'react'
import input from '../../config/input.js'
import colors from '../../config/colors.js'
import { margins, fontSizes } from '../../config/scales.js'

export default class DocLabel extends React.Component {
  static propTypes = {
    label: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.string
    ]).isRequired,
    doc: React.PropTypes.string.isRequired,
    style: React.PropTypes.object,
    cursorTargetStyle: React.PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = { showDoc: false }
  }

  render() {
    return <label
      style={{
        ...input.label,
        position: 'relative',
        verticalAlign: 'top',
        ...this.props.style,
      }}
    >
      <span
        onMouseOver={e => this.setState({showDoc: true})}
        onMouseOut={e => this.setState({showDoc: false})}
        style={{
          cursor: 'help',
          ...this.props.cursorTargetStyle,
        }}
      >
        {this.props.label}
      </span>
      <div style={{
        backgroundColor: colors.gray,
        padding: margins[1],
        fontSize: 10,
        position: 'absolute',
        top: 20,
        left: 0,
        width: 120,
        display: this.state.showDoc ? null : 'none',
        zIndex: 3,
      }}>
        {this.props.doc}
      </div>
    </label>
  }
}
