import React from 'react'
import PropTypes from 'prop-types'
import Collapser from './Collapser'
import Collapse from './Collapse'


export default class LayerEditorGroup extends React.Component {
  static propTypes = {
    "data-wd-key": PropTypes.string,
    title: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired,
    onActiveToggle: PropTypes.func.isRequired
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
      <Collapse isActive={this.props.isActive}>
        <div className="react-collapse-container">
          {this.props.children}
        </div>
      </Collapse>
    </div>
  }
}
