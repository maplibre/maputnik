import React from 'react'
import Paragraph from './Paragraph'
import colors from '../config/colors'
import { fontSizes, margins } from '../config/scales'

class ErrorPanel extends React.Component {
  static propTypes = {
    messages: React.PropTypes.array,
  }

  render() {
    return <div style={{
      padding: margins[1],
    }}>
      {this.props.messages.map(m => <Paragraph style={{
        color: colors.red,
        margin: 0,
        lineHeight: 1.2,
      }}>{m}</Paragraph>)}
    </div>
  }
}


export default ErrorPanel
