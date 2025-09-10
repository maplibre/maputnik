import React from 'react'

import type {CSSProperties} from 'react'
import { BsDiamond, BsDiamondFill, BsFonts } from 'react-icons/bs'
import { MdOutlineCircle, MdPriorityHigh } from 'react-icons/md'
import { IoAnalyticsOutline } from 'react-icons/io5'

type IconLayerProps = {
  type: string
  style?: CSSProperties
  className?: string
};

const IconLayer: React.FC<IconLayerProps> = (props) => {
  const iconProps = { style: props.style }
  switch(props.type) {
  case 'fill-extrusion': return <BsDiamondFill {...iconProps} />
  case 'raster': return <BsDiamond {...iconProps} />
  case 'hillshade': return <BsDiamond {...iconProps} />
  case 'heatmap': return <BsDiamond {...iconProps} />
  case 'fill': return <BsDiamond {...iconProps} />
  case 'background': return <BsDiamondFill {...iconProps} />
  case 'line': return <IoAnalyticsOutline {...iconProps} />
  case 'symbol': return <BsFonts {...iconProps} />
  case 'circle': return <MdOutlineCircle {...iconProps} />
  default: return <MdPriorityHigh {...iconProps} />
  }
}

export default IconLayer;
