import React from 'react'
import PropTypes from 'prop-types'
import Collapse from 'react-collapse'
import Collapser from './Collapser'

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
      <button className="maputnik-layer-editor-group"
        data-wd-key={"layer-editor-group:"+this.props["data-wd-key"]}
        aria-expanded={this.props.isActive}
        onClick={e => this.props.onActiveToggle(!this.props.isActive)}
      >
        <span>{this.props.title}</span>
        <span style={{flexGrow: 1}} />
        <Collapser isCollapsed={this.props.isActive} />
      </button>
      <Collapse isOpened={this.props.isActive}>
        <div className="react-collapse-container">
          {this.props.children}
        </div>
      </Collapse>
    </div>
  }
}
