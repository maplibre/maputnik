import React from 'react'

import IconLine from './IconLine'
import IconFill from './IconFill'
import IconSymbol from './IconSymbol'
import IconBackground from './IconBackground'
import IconCircle from './IconCircle'
import IconMissing from './IconMissing'

type IconLayerProps = {
  type: string
  style?: object
};

export default class IconLayer extends React.Component<IconLayerProps> {
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

