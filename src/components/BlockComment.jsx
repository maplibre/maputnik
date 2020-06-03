import React from 'react'
import PropTypes from 'prop-types'

import Block from './Block'
import FieldString from './FieldString'

export default class BlockComment extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

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

