import React from 'react'
import theme from './theme.js'
import scrollbars from './scrollbars.scss'

const ScrollContainer = (props) => {
  return <div className={scrollbars.darkScrollbar} style={{
    overflowY: "scroll",
    bottom:0,
    left:0,
    right:0,
    top:1,
    position: "absolute",
    padding: theme.scale[2],
  }}>
    {props.children}
  </div>
}

export default ScrollContainer
