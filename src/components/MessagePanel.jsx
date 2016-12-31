import React from 'react'
import Paragraph from './Paragraph'
import colors from '../config/colors'
import { fontSizes, margins } from '../config/scales'

class MessagePanel extends React.Component {
  static propTypes = {
    errors: React.PropTypes.array,
    infos: React.PropTypes.array,
  }

  render() {
    const paragraphStyle = {
      margin: 0,
      lineHeight: 1.2,
    }

    const errors = this.props.errors.map((m, i) => {
      return <Paragraph key={i}
        style={{
          ...paragraphStyle,
          color: colors.red,
        }}>{m}</Paragraph>
    })

    const infos = this.props.infos.map((m, i) => {
      return <Paragraph key={i}
        style={{
          ...paragraphStyle,
          color: colors.lowgray,
        }}>{m}</Paragraph>
    })

    return <div style={{
      padding: margins[1],
    }}>
      {errors}
      {infos}
    </div>
  }
}


export default MessagePanel
