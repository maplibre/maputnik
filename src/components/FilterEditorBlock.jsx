import React from 'react'
import PropTypes from 'prop-types'
import InputButton from './InputButton'
import {MdDelete} from 'react-icons/md'

export default class FilterEditorBlock extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
  }

  render() {
    return <div className="maputnik-filter-editor-block">
      <div className="maputnik-filter-editor-block-action">
        <InputButton
          className="maputnik-delete-filter"
          onClick={this.props.onDelete}
          title="Delete filter block"
        >
          <MdDelete />
        </InputButton>
      </div>
      <div className="maputnik-filter-editor-block-content">
        {this.props.children}
      </div>
    </div>
  }
}

