import React from 'react'

import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'

class MetadataBlock extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"Comments"} doc={"Comments for the current layer. This is non-standard and not in the spec."}>
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
