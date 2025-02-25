import React from 'react'
import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md'

type CollapserProps = {
  isCollapsed: boolean
  style?: object
};

export default class Collapser extends React.Component<CollapserProps> {
  render() {
    const iconStyle = {
      width: 20,
      height: 20,
      ...this.props.style,
    }
    return this.props.isCollapsed ? <MdArrowDropUp style={iconStyle}/> : <MdArrowDropDown style={iconStyle} />
  }
}
