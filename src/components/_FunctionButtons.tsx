import React from 'react'

import InputButton from './InputButton'
import {MdFunctions, MdInsertChart} from 'react-icons/md'
import {mdiFunctionVariant} from '@mdi/js';
import { WithTranslation, withTranslation } from 'react-i18next';

type FunctionInputButtonsInternalProps = {
  fieldSpec?: any
  onZoomClick?(...args: unknown[]): unknown
  onDataClick?(...args: unknown[]): unknown
  onExpressionClick?(...args: unknown[]): unknown
} & WithTranslation;

class FunctionInputButtonsInternal extends React.Component<FunctionInputButtonsInternalProps> {
  render() {
    const t = this.props.t;
    let makeZoomInputButton, makeDataInputButton, expressionInputButton;

    if (this.props.fieldSpec.expression?.parameters.includes('zoom')) {
      expressionInputButton = (
        <InputButton
          className="maputnik-make-zoom-function"
          onClick={this.props.onExpressionClick}
          title={t("Convert to expression")}
        >
          <svg style={{width:"14px", height:"14px", verticalAlign: "middle"}} viewBox="0 0 24 24">
            <path fill="currentColor" d={mdiFunctionVariant} />
          </svg>
        </InputButton>
      );

      makeZoomInputButton = <InputButton
        className="maputnik-make-zoom-function"
        onClick={this.props.onZoomClick}
        title={t("Convert property into a zoom function")}
      >
        <MdFunctions />
      </InputButton>

      if (this.props.fieldSpec['property-type'] === 'data-driven') {
        makeDataInputButton = <InputButton
          className="maputnik-make-data-function"
          onClick={this.props.onDataClick}
          title={t("Convert property to data function")}
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

const FunctionInputButtons = withTranslation()(FunctionInputButtonsInternal);
export default FunctionInputButtons;
