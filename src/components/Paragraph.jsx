import React from 'react'
import colors from '../config/colors'
import { margins, fontSizes } from '../config/scales'

const Paragraph = (props) => <p style={{
  color: colors.lowgray,
  fontSize: fontSizes[5],
  ...props.style
}}>
  {props.children}
</p>

export default Paragraph
