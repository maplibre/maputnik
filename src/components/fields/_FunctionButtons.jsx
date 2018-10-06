import React from 'react'
import PropTypes from 'prop-types'

import DocLabel from './DocLabel'
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
      >
        <DocLabel
          label={<MdFunctions />}
          cursorTargetStyle={{ cursor: 'pointer' }}
          doc={"Turn property into a zoom function to enable a map feature to change with map's zoom level."}
        />
      </Button>

      if (this.props.fieldSpec['property-type'] === 'data-driven') {
        makeDataButton = <Button
          className="maputnik-make-data-function"
          onClick={this.props.onDataClick}
        >
          <DocLabel
            label={<MdInsertChart />}
            cursorTargetStyle={{ cursor: 'pointer' }}
            doc={"Turn property into a data function to enable a map feature to change according to data properties and the map's zoom level."}
          />
        </Button>
      }
      return <div>{makeDataButton}{makeZoomButton}</div>
    }
    else {
      return null
    }
  }
}
