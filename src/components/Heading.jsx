import React from 'react'
import { fontSizes, margins } from '../config/scales'

class Heading extends React.Component {
  static propTypes = {
    level: React.PropTypes.number.isRequired,
    style: React.PropTypes.object,
  }

  render() {
    const headingProps = {
      style: {
        fontWeight: 400,
        fontSize: fontSizes[this.props.level - 1],
        marginBottom: margins[1],
        ...this.props.style
      }
    }

    switch(this.props.level) {
      case 1: return <h1 {...headingProps}>{this.props.children}</h1>
      case 2: return <h2 {...headingProps}>{this.props.children}</h2>
      case 3: return <h3 {...headingProps}>{this.props.children}</h3>
      case 4: return <h4 {...headingProps}>{this.props.children}</h4>
      case 5: return <h5 {...headingProps}>{this.props.children}</h5>
      default: return <h6 {...headingProps}>{this.props.children}</h6>
    }
  }
}


export default Heading
