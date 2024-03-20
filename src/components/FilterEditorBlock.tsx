import React, { PropsWithChildren } from 'react'
import InputButton from './InputButton'
import {MdDelete} from 'react-icons/md'

type FilterEditorBlockProps = PropsWithChildren & {
  onDelete(...args: unknown[]): unknown
};

export default class FilterEditorBlock extends React.Component<FilterEditorBlockProps> {
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

