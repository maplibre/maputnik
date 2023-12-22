import React from 'react'

import Block from './Block'
import FieldString from './FieldString'

type BlockCommentProps = {
  value?: string
  onChange(...args: unknown[]): unknown
};

export default class BlockComment extends React.Component<BlockCommentProps> {
  render() {
    const fieldSpec = {
      doc: "Comments for the current layer. This is non-standard and not in the spec."
    };

    return <Block
      label={"Comments"}
      fieldSpec={fieldSpec}
      data-wd-key="layer-comment"
    >
      <FieldString
        multi={true}
        value={this.props.value}
        onChange={this.props.onChange}
        default="Comment..."
      />
    </Block>
  }
}

