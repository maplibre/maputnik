import React from 'react'

import LineIcon from './line.jsx'
import FillIcon from './fill.jsx'
import SymbolIcon from './symbol.jsx'
import BackgroundIcon from './background.jsx'

class LayerIcon extends React.Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    style: React.PropTypes.object,
  }

  render() {
    if (this.props.type === "fill") {
      return <FillIcon style={this.props.style} />
    }

    if (this.props.type === "background") {
      return <BackgroundIcon style={this.props.style} />
    }

    if (this.props.type === "line") {
      return <LineIcon style={this.props.style} />
    }

    if (this.props.type === "symbol") {
      return <SymbolIcon style={this.props.style} />
    }

    return null
  }
}

export default LayerIcon
