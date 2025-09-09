import React, { type CSSProperties } from 'react'
import { IoAnalyticsOutline } from 'react-icons/io5';


const IconLine: React.FC<{style: CSSProperties | undefined}> = (props) => {
  return (
    <IoAnalyticsOutline {...props} />
  )
}

export default IconLine;
