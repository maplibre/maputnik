import React, { type CSSProperties } from 'react'
import { BsDiamond } from 'react-icons/bs';


const IconFill: React.FC<{style: CSSProperties | undefined}> = (props) => {
  return (
    <BsDiamond {...props} />
  )
}
export default IconFill;
