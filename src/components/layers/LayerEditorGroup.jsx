import React from 'react'
import Collapse from 'react-collapse'
import Collapser from './Collapser'

export default class LayerEditorGroup extends React.Component {
  static propTypes = {
    "data-wd-key": React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
    isActive: React.PropTypes.bool.isRequired,
    children: React.PropTypes.element.isRequired,
    onActiveToggle: React.PropTypes.func.isRequired
  }

  render() {
    return <div>
      <div className="maputnik-layer-editor-group"
        data-wd-key={"layer-editor-group:"+this.props["data-wd-key"]}
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
