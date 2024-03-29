import React from 'react'

import Block from './Block'
import InputString from './InputString'

type FieldCommentProps = {
  value?: string
  onChange(value: string | undefined): unknown
  error: {message: string}
};

export default class FieldComment extends React.Component<FieldCommentProps> {
  render() {
    const fieldSpec = {
      doc: "Comments for the current layer. This is non-standard and not in the spec."
    };

    return <Block
      label={"Comments"}
      fieldSpec={fieldSpec}
      data-wd-key="layer-comment"
      error={this.props.error}
    >
      <InputString
        multi={true}
        value={this.props.value}
        onChange={this.props.onChange}
        default="Comment..."
        data-wd-key="layer-comment.input"
      />
    </Block>
  }
}
