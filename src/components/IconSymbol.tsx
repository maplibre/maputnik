import React, { type CSSProperties } from 'react'
import { BsFonts } from 'react-icons/bs';


const IconSymbol: React.FC<{style: CSSProperties | undefined}> = (props) => {
  return (
    <BsFonts {...props} />
  )
}
export default IconSymbol;
