import React, { type CSSProperties } from 'react'
import {MdOutlineCircle} from 'react-icons/md'

const IconCircle: React.FC<{style: CSSProperties | undefined}> = (props) => {
  return (
    <MdOutlineCircle {...props} />
  )
}
export default IconCircle;
