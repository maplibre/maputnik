import React from 'react'
import PropTypes from 'prop-types'

import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'

class MetadataBlock extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const fieldSpec = {
      doc: "Comments for the current layer. This is non-standard and not in the spec."
    };

    return <InputBlock
      label={"Comments"}
      fieldSpec={fieldSpec}
      data-wd-key="layer-comment"
    >
      <StringInput
        multi={true}
        value={this.props.value}
        onChange={this.props.onChange}
        default="Comment..."
      />
    </InputBlock>
  }
}

export default MetadataBlock
