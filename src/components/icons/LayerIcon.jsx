import React from 'react'

import LineIcon from './LineIcon.jsx'
import FillIcon from './FillIcon.jsx'
import SymbolIcon from './SymbolIcon.jsx'
import BackgroundIcon from './BackgroundIcon.jsx'

class LayerIcon extends React.Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    style: React.PropTypes.object,
  }

  render() {
    const iconProps = { style: this.props.style }
    switch(this.props.type) {
      case 'fill': return <FillIcon {...iconProps} />
      case 'background': return <BackgroundIcon {...iconProps} />
      case 'line': return <LineIcon {...iconProps} />
      case 'symbol': return <SymbolIcon {...iconProps} />
      default: return null
    }
  }
}

export default LayerIcon
