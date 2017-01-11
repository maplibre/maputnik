import React from 'react'
import input from '../../config/input'
import DocLabel from '../fields/DocLabel'

/** Wrap a component with a label */
class InputBlock extends React.Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    doc: React.PropTypes.string,
    children: React.PropTypes.element.isRequired,
    style: React.PropTypes.object,
  }

  onChange(e) {
    const value = e.target.value
    return this.props.onChange(value === "" ? null: value)
  }

  renderChildren() {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        style: {
          ...child.props.style,
          width: '50%',
        }
      })
    })
  }

  render() {
    return <div style={this.props.style}
      className="maputnik-input-block"
      >
      {this.props.doc &&
      <DocLabel
        label={this.props.label}
        doc={this.props.doc}
        style={{
          width: '50%',
        }}
      />
      }
      {!this.props.doc &&
      <label className="maputnik-input-block-label">
        {this.props.label}
      </label>
      }
      {this.renderChildren()}
    </div>
  }
}

export default InputBlock
