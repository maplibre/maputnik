import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import {MdDelete} from 'react-icons/md'

class FilterEditorBlock extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
  }

  render() {
    return <div className="maputnik-filter-editor-block">
      <div className="maputnik-filter-editor-block-action">
        <Button
          className="maputnik-delete-filter"
          onClick={this.props.onDelete}
        >
          <MdDelete />
        </Button>
      </div>
      <div className="maputnik-filter-editor-block-content">
        {this.props.children}
      </div>
    </div>
  }
}

export default FilterEditorBlock
