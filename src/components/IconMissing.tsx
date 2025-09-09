import React, { type CSSProperties } from 'react'
import {MdPriorityHigh} from 'react-icons/md'

const IconMissing: React.FC<{style: CSSProperties | undefined}> = (props) => {
  return (
    <MdPriorityHigh {...props} />
  )
}
export default IconMissing;
