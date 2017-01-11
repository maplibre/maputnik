import React from 'react'
import Button from '../Button'
import DeleteIcon from 'react-icons/lib/md/delete'

class FilterEditorBlock extends React.Component {
  static propTypes = {
    onDelete: React.PropTypes.func.isRequired,
    children: React.PropTypes.element.isRequired,
  }

  render() {
    return <div className="maputnik-filter-editor-block">
      <div className="maputnik-filter-editor-block-action">
        <Button
          className="maputnik-delete-filter"
          onClick={this.props.onDelete}
        >
          <DeleteIcon />
        </Button>
      </div>
      <div className="maputnik-filter-editor-block-content">
        {this.props.children}
      </div>
    </div>
  }
}

export default FilterEditorBlock
