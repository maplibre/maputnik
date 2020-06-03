import React from 'react'
import PropTypes from 'prop-types'

import IconLine from './IconLine.jsx'
import IconFill from './IconFill.jsx'
import IconSymbol from './IconSymbol.jsx'
import IconBackground from './IconBackground.jsx'
import IconCircle from './IconCircle.jsx'
import IconMissing from './IconMissing.jsx'

export default class IconLayer extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    style: PropTypes.object,
  }

  render() {
    const iconProps = { style: this.props.style }
    switch(this.props.type) {
      case 'fill-extrusion': return <IconBackground {...iconProps} />
      case 'raster': return <IconFill {...iconProps} />
      case 'hillshade': return <IconFill {...iconProps} />
      case 'heatmap': return <IconFill {...iconProps} />
      case 'fill': return <IconFill {...iconProps} />
      case 'background': return <IconBackground {...iconProps} />
      case 'line': return <IconLine {...iconProps} />
      case 'symbol': return <IconSymbol {...iconProps} />
      case 'circle': return <IconCircle {...iconProps} />
      default: return <IconMissing {...iconProps} />
    }
  }
}

