import React from 'react'
import PropTypes from 'prop-types'

import InputButton from './InputButton'
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

export default class FunctionInputButtons extends React.Component {
  static propTypes = {
    fieldSpec: PropTypes.object,
    onZoomClick: PropTypes.func,
    onDataClick: PropTypes.func,
    onExpressionClick: PropTypes.func,
  }

  render() {
    let makeZoomInputButton, makeDataInputButton, expressionInputButton;

    if (this.props.fieldSpec.expression.parameters.includes('zoom')) {
      expressionInputButton = (
        <InputButton
          className="maputnik-make-zoom-function"
          onClick={this.props.onExpressionClick}
          title="Convert to expression"
        >
          <svg style={{width:"14px", height:"14px", verticalAlign: "middle"}} viewBox="0 0 24 24">
            <path fill="currentColor" d={mdiFunctionVariant} />
          </svg>
        </InputButton>
      );

      makeZoomInputButton = <InputButton
        className="maputnik-make-zoom-function"
        onClick={this.props.onZoomClick}
        title="Convert property into a zoom function"
      >
        <MdFunctions />
      </InputButton>

      if (this.props.fieldSpec['property-type'] === 'data-driven') {
        makeDataInputButton = <InputButton
          className="maputnik-make-data-function"
          onClick={this.props.onDataClick}
          title="Convert property to data function"
        >
          <MdInsertChart />
        </InputButton>
      }
      return <div>
        {expressionInputButton}
        {makeDataInputButton}
        {makeZoomInputButton}
      </div>
    }
    else {
      return <div>{expressionInputButton}</div>
    }
  }
}
