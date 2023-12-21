import React from 'react'

import InputButton from './InputButton'
import {MdFunctions, MdInsertChart} from 'react-icons/md'
import {mdiFunctionVariant} from '@mdi/js';

type FunctionInputButtonsProps = {
  fieldSpec?: any
  onZoomClick?(...args: unknown[]): unknown
  onDataClick?(...args: unknown[]): unknown
  onExpressionClick?(...args: unknown[]): unknown
};

export default class FunctionInputButtons extends React.Component<FunctionInputButtonsProps> {
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
