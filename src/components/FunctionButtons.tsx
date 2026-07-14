import React from "react";

import { InputButton } from "./InputButton";
import {MdFunctions, MdInsertChart} from "react-icons/md";
import { TbMathFunction } from "react-icons/tb";
import { type WithTranslation, withTranslation } from "react-i18next";

type FunctionInputButtonsInternalProps = {
  fieldSpec?: any
  onZoomClick?(): void
  onDataClick?(): void
  onExpressionClick?(): void
  onElevationClick?(): void
} & WithTranslation;

const FunctionInputButtonsInternal: React.FC<FunctionInputButtonsInternalProps> = (props) => {
  const t = props.t;

  if (props.fieldSpec.expression?.parameters.includes("zoom")) {
    const expressionInputButton = (
      <InputButton
        className="maputnik-make-zoom-function"
        onClick={props.onExpressionClick}
        title={t("Convert to expression")}
      >
        <TbMathFunction />
      </InputButton>
    );

    const makeZoomInputButton = <InputButton
      className="maputnik-make-zoom-function"
      onClick={props.onZoomClick}
      title={t("Convert property into a zoom function")}
    >
      <MdFunctions />
    </InputButton>;

    let makeDataInputButton;
    if (props.fieldSpec["property-type"] === "data-driven") {
      makeDataInputButton = <InputButton
        className="maputnik-make-data-function"
        onClick={props.onDataClick}
        title={t("Convert property to data function")}
      >
        <MdInsertChart />
      </InputButton>;
    }
    return <div>
      {expressionInputButton}
      {makeDataInputButton}
      {makeZoomInputButton}
    </div>;
  } else if (props.fieldSpec.expression?.parameters.includes("elevation")) {
    const inputElevationButton = <InputButton
      className="maputnik-make-elevation-function"
      onClick={props.onElevationClick}
      title={t("Convert property into a elevation function")}
      data-wd-key='make-elevation-function'
    >
      <MdFunctions />
    </InputButton>;
    return <div>{inputElevationButton}</div>;
  } else {
    return <div></div>;
  }
};

export const FunctionInputButtons = withTranslation()(FunctionInputButtonsInternal);
