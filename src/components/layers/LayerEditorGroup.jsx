import React from 'react'
import Color from 'color'
import colors from '../../config/colors'
import { margins, fontSizes } from '../../config/scales'

import Collapse from 'react-collapse'
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

  constructor(props) {
    super(props)
    this.state = { hover: false }
  }

  render() {
    return <div>
      <div className="maputnik-layer-editor-group"
        onMouseOver={e => this.setState({hover: true})}
        onMouseOut={e => this.setState({hover: false})}
        onClick={e => this.props.onActiveToggle(!this.props.isActive)}
      >
        <span>{this.props.title}</span>
        <span style={{flexGrow: 1}} />
        <Collapser isCollapsed={this.props.isActive} />
      </div>
      <Collapse isOpened={this.props.isActive}>
        {this.props.children}
      </Collapse>
    </div>
  }
}
