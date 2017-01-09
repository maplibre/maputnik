import React from 'react'
import Button from '../Button'
import DeleteIcon from 'react-icons/lib/md/delete'

class FilterEditorBlock extends React.Component {
  static propTypes = {
    onDelete: React.PropTypes.func.isRequired,
    children: React.PropTypes.element.isRequired,
  }

  renderChildren() {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        style: {
          ...child.props.style,
          display: 'inline-block',
          width: '75%',
        }
      })
    })
  }

  render() {
    return <div>
      <div style={{display: 'inline-block', width: '25%'}}>
        <Button
          style={{backgroundColor: null}}
          onClick={this.props.onDelete}
        >
          <DeleteIcon />
        </Button>
      </div>
      {this.props.children}
    </div>
  }
}

export default FilterEditorBlock
