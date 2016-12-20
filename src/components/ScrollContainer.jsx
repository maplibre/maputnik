import React from 'react'
import scrollbars from './scrollbars.scss'

const ScrollContainer = (props) => {
  return <div className={scrollbars.darkScrollbar} style={{
    overflowY: "scroll",
    bottom:0,
    left:0,
    right:0,
    top:1,
    position: "absolute",
  }}>
    {props.children}
  </div>
}

export default ScrollContainer
