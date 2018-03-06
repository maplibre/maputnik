import React from 'react'
import PropTypes from 'prop-types'

import LineIcon from './LineIcon.jsx'
import FillIcon from './FillIcon.jsx'
import SymbolIcon from './SymbolIcon.jsx'
import BackgroundIcon from './BackgroundIcon.jsx'
import CircleIcon from './CircleIcon.jsx'

class LayerIcon extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    style: PropTypes.object,
  }

  render() {
    const iconProps = { style: this.props.style }
    switch(this.props.type) {
      case 'fill-extrusion': return <BackgroundIcon {...iconProps} />
      case 'raster': return <FillIcon {...iconProps} />
      case 'hillshade': return <FillIcon {...iconProps} />
      case 'heatmap': return <FillIcon {...iconProps} />
      case 'fill': return <FillIcon {...iconProps} />
      case 'background': return <BackgroundIcon {...iconProps} />
      case 'line': return <LineIcon {...iconProps} />
      case 'symbol': return <SymbolIcon {...iconProps} />
      case 'circle': return <CircleIcon {...iconProps} />
    }
  }
}

export default LayerIcon
