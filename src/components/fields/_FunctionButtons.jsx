import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button'
import {MdFunctions, MdInsertChart} from 'react-icons/md'


export default class FunctionButtons extends React.Component {
  static propTypes = {
    fieldSpec: PropTypes.object,
    onZoomClick: PropTypes.func,
    onDataClick: PropTypes.func,
  }

  render() {
    let makeZoomButton, makeDataButton
    if (this.props.fieldSpec.expression.parameters.includes('zoom')) {
      makeZoomButton = <Button
        className="maputnik-make-zoom-function"
        onClick={this.props.onZoomClick}
        title={"Turn property into a zoom function to enable a map feature to change with map's zoom level."}
      >
        <MdFunctions />
      </Button>

      if (this.props.fieldSpec['property-type'] === 'data-driven') {
        makeDataButton = <Button
          className="maputnik-make-data-function"
          onClick={this.props.onDataClick}
          title={"Turn property into a data function to enable a map feature to change according to data properties and the map's zoom level."}
        >
          <MdInsertChart />
        </Button>
      }
      return <div>{makeDataButton}{makeZoomButton}</div>
    }
    else {
      return null
    }
  }
}
