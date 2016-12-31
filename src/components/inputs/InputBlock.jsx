import React from 'react'
import input from '../../config/input'
import { margins } from '../../config/scales'

/** Wrap a component with a label */
class InputBlock extends React.Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
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
    return <div style={{
      ...input.property,
      ...this.props.style,
    }}>
      <label
        style={{
          ...input.label,
          width: '50%',
      }}>
        {this.props.label}
      </label>
      {this.renderChildren()}
    </div>
  }
}

export default InputBlock
