import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button'
import {MdFunctions, MdInsertChart} from 'react-icons/md'
import {mdiFunctionVariant} from '@mdi/js';


/**
 * So here we can't just check is `Array.isArray(value)` because certain
 * properties accept arrays as values, for example `text-font`. So we must try
 * and create an expression.
 */
function isExpression(value, fieldSpec={}) {
  if (!Array.isArray(value)) {
    return false;
  }
  try {
    expression.createExpression(value, fieldSpec);
    return true;
  }
  catch (err) {
    return false;
  }
}

export default class FunctionButtons extends React.Component {
  static propTypes = {
    fieldSpec: PropTypes.object,
    onZoomClick: PropTypes.func,
    onDataClick: PropTypes.func,
    onExpressionClick: PropTypes.func,
  }

  render() {
    let makeZoomButton, makeDataButton, expressionButton;

    if (this.props.fieldSpec.expression.parameters.includes('zoom')) {
      expressionButton = (
        <Button
          className="maputnik-make-zoom-function"
          onClick={this.props.onExpressionClick}
        >
          <svg style={{width:"14px", height:"14px", verticalAlign: "middle"}} viewBox="0 0 24 24">
            <path fill="currentColor" d={mdiFunctionVariant} />
          </svg>
        </Button>
      );

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
      return <div>
        {expressionButton}
        {makeDataButton}
        {makeZoomButton}
      </div>
    }
    else {
      return <div>{expressionButton}</div>
    }
  }
}
