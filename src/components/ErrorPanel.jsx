import React from 'react'
import Paragraph from './Paragraph'
import colors from '../config/colors'
import { fontSizes, margins } from '../config/scales'

class ErrorPanel extends React.Component {
  static propTypes = {
    messages: React.PropTypes.array,
  }

  render() {
    const errors = this.props.messages.map((m, i) => {
      return <Paragraph key={i}
        style={{
          color: colors.red,
          margin: 0,
          lineHeight: 1.2,
        }}>
        {m}
      </Paragraph>
    })

    return <div style={{
      padding: margins[1],
    }}>
      {errors}
    </div>
  }
}


export default ErrorPanel
