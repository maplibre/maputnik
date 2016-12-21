import React from 'react'
import colors from '../../config/colors'
import { margins, fontSizes } from '../../config/scales'

import CollapseOpenIcon from 'react-icons/lib/md/arrow-drop-down'
import CollapseCloseIcon from 'react-icons/lib/md/arrow-drop-up'

class Collapser extends React.Component {
  static propTypes = {
    isCollapsed: React.PropTypes.bool.isRequired,
  }

  render() {
    const iconStyle = {
      width: 20,
      height: 20,
    }
    return this.props.isCollapsed ? <CollapseCloseIcon style={iconStyle}/> : <CollapseOpenIcon style={iconStyle} />
  }
}

export default class LayerEditorGroup extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    isActive: React.PropTypes.bool.isRequired,
    children: React.PropTypes.element.isRequired,
    onActiveToggle: React.PropTypes.func.isRequired
  }

  render() {
    return <div>
      <div style={{
        fontSize: fontSizes[4],
        backgroundColor: colors.gray,
        color: colors.lowgray,
        padding: margins[1],
        display: 'flex',
        flexDirection: 'row',
        lineHeight: '20px',
      }}
        onClick={e => this.props.onActiveToggle(!this.props.isActive)}
      >
        <span>{this.props.title}</span>
        <span style={{flexGrow: 1}} />
        <Collapser isCollapsed={this.props.isActive} />
      </div>
      <div style={{
        display: this.props.isActive ? null : 'none',
        border: 2,
        borderStyle: 'solid',
        borderColor: colors.gray,
      }}>
        {this.props.children}
      </div>
    </div>
  }
}
