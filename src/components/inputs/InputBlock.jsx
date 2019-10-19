import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import DocLabel from '../fields/DocLabel'

/** Wrap a component with a label */
class InputBlock extends React.Component {
  static propTypes = {
    "data-wd-key": PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
    doc: PropTypes.string,
    action: PropTypes.element,
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func,
  }

  constructor (props) {
    super(props);
    this.state = {
      showDoc: false,
    }
  }

  onChange(e) {
    const value = e.target.value
    return this.props.onChange(value === "" ? undefined : value)
  }

  onToggleDoc = (val) => {
    this.setState({
      showDoc: val
    });
  }

  render() {
    return <div style={this.props.style}
      data-wd-key={this.props["data-wd-key"]}
      className={classnames({
        "maputnik-input-block": true,
        "maputnik-action-block": this.props.action
      })}
      >
      {this.props.doc &&
      <div className="maputnik-input-block-label">
        <DocLabel
          label={this.props.label}
          doc={this.props.doc}
          onToggleDoc={this.onToggleDoc}
        />
      </div>
      }
      {!this.props.doc &&
      <label className="maputnik-input-block-label">
        {this.props.label}
      </label>
      }
      {this.props.action &&
      <div className="maputnik-input-block-action">
        {this.props.action}
      </div>
      }
      <div className="maputnik-input-block-content">
        {this.props.children}
      </div>
      {this.props.doc &&
      <div
        className="maputnik-doc-inline"
        style={{display: this.state.showDoc ? '' : 'none'}}
      >
        {this.props.doc}
      </div>
      }
    </div>
  }
}

export default InputBlock
