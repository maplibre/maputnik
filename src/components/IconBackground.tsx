import React, { type CSSProperties } from 'react'
import { BsDiamondFill } from 'react-icons/bs';

const IconBackground: React.FC<{style: CSSProperties | undefined}> = (props) => {
  return (
    <BsDiamondFill {...props} />
  )
}

export default IconBackground;
