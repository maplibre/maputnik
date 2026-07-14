import React, { useRef } from "react";
import { PiListPlusBold } from "react-icons/pi";
import { TbMathFunction } from "react-icons/tb";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import { type WithTranslation, withTranslation } from "react-i18next";

import { InputButton } from "./InputButton";
import { InputSpec } from "./InputSpec";
import { InputNumber } from "./InputNumber";
import { InputSelect } from "./InputSelect";
import { Block } from "./Block";

import { DeleteStopButton } from "./DeleteStopButton";
import { labelFromFieldName } from "../libs/label-from-field-name";

import { generateUniqueId as docUid } from "../libs/document-uid";
import { sortNumerically } from "../libs/sort-numerically";
import { type MappedLayerErrors } from "../libs/definitions";


/**
 * We cache a reference for each stop by its index.
 *
 * When the stops are reordered the references are also updated (see this.orderStops) this allows React to use the same key for the element and keep keyboard focus.
 */
function setStopRefs(props: ZoomPropertyInternalProps, state: ZoomPropertyState) {
  // This is initialised below only if required to improved performance.
  let newRefs: {[key: number]: string} = {};

  if(props.value && (props.value as ZoomWithStops).stops) {
    (props.value as ZoomWithStops).stops.forEach((_val, idx: number) => {
      if(Object.prototype.hasOwnProperty.call(!state.refs, idx)) {
        if(!newRefs) {
          newRefs = {...state};
        }
        newRefs[idx] = docUid("stop-");
      } else {
        newRefs[idx] = state.refs[idx];
      }
    });
  }
  return newRefs;
}

type ZoomWithStops = {
  stops: [number | undefined, number][]
  base?: number
};


type ZoomPropertyInternalProps = {
  onChange?(...args: unknown[]): unknown
  onChangeToDataFunction?(...args: unknown[]): unknown
  onDeleteStop?(...args: unknown[]): unknown
  onAddStop?(...args: unknown[]): unknown
  onExpressionClick?(...args: unknown[]): unknown
  fieldType?: string
  fieldName: string
  fieldSpec?: {
    "property-type"?: string
    "function-type"?: string
  }
  errors?: MappedLayerErrors
  value?: ZoomWithStops
} & WithTranslation;

type ZoomPropertyState = {
  refs: {[key: number]: string}
};

const ZoomPropertyInternal: React.FC<ZoomPropertyInternalProps> = ({ errors = {}, ...rest }) => {
  const props = { errors, ...rest } as ZoomPropertyInternalProps;

  // The stop refs never reach the rendered output (the row key is derived from
  // the stop itself), so they live in a ref rather than state: keeping them in
  // state would mean setting state during render on every pass.
  const refs = useRef<{[key: number]: string}>({});
  refs.current = setStopRefs(props, { refs: refs.current });

  // Order the stops altering the refs to reflect their new position.
  function orderStopsByZoom(stops: ZoomWithStops["stops"]) {
    const mappedWithRef = stops
      .map((stop, idx) => {
        return {
          ref: refs.current[idx],
          data: stop
        };
      })
    // Sort by zoom
      .sort((a, b) => sortNumerically(a.data[0]!, b.data[0]!));

    // Fetch the new position of the stops
    const newRefs: {[key:number]: string} = {};
    mappedWithRef
      .forEach((stop, idx) =>{
        newRefs[idx] = stop.ref;
      });

    refs.current = newRefs;

    return mappedWithRef.map((item) => item.data);
  }

  function changeZoomStop(changeIdx: number, stopData: number | undefined, value: number) {
    const stops = (props.value as ZoomWithStops).stops.slice(0);
    stops[changeIdx] = [stopData, value];

    const orderedStops = orderStopsByZoom(stops);

    const changedValue = {
      ...props.value as ZoomWithStops,
      stops: orderedStops
    };
    props.onChange!(props.fieldName, changedValue);
  }

  function changeBase(newValue: number | undefined) {
    const changedValue = {
      ...props.value,
      base: newValue
    };

    if (changedValue.base === undefined) {
      delete changedValue["base"];
    }
    props.onChange!(props.fieldName, changedValue);
  }

  const changeDataType = (type: string) => {
    if (type !== "interpolate" && props.onChangeToDataFunction) {
      props.onChangeToDataFunction(type);
    }
  };

  function getDataFunctionTypes(fieldSpec: {
    "property-type"?: string
    "function-type"?: string
  }) {
    if (fieldSpec["property-type"] === "data-driven") {
      return ["interpolate", "categorical", "interval", "exponential", "identity"];
    }
    else {
      return ["interpolate"];
    }
  }

  const t = props.t;
  const zoomFields = props.value?.stops.map((stop, idx) => {
    const zoomLevel = stop[0];
    const value = stop[1];
    const deleteStopBtn = <DeleteStopButton onClick={props.onDeleteStop?.bind(null, idx)} />;
    return <tr
      key={`${stop[0]}-${stop[1]}`}
    >
      <td>
        <InputNumber
          aria-label={t("Zoom")}
          value={zoomLevel}
          onChange={changedStop => changeZoomStop(idx, changedStop, value)}
          min={0}
          max={22}
        />
      </td>
      <td>
        <InputSpec
          aria-label={t("Output value")}
          fieldName={props.fieldName}
          fieldSpec={props.fieldSpec as any}
          value={value}
          onChange={(_, newValue) => changeZoomStop(idx, zoomLevel, newValue as number)}
        />
      </td>
      <td>
        {deleteStopBtn}
      </td>
    </tr>;
  });

  // return <div className="maputnik-zoom-spec-property">
  return <div className="maputnik-data-spec-block">
    <fieldset className="maputnik-data-spec-property">
      <legend>{labelFromFieldName(props.fieldName)}</legend>
      <div className="maputnik-data-fieldset-inner">
        <Block
          label={t("Function")}
          data-wd-key="function-type"
        >
          <div className="maputnik-data-spec-property-input">
            <InputSelect
              value={"interpolate"}
              onChange={(propVal: string) => changeDataType(propVal)}
              title={t("Select a type of data scale (default is 'categorical').")}
              options={getDataFunctionTypes(props.fieldSpec!)}
            />
          </div>
        </Block>
        <Block
          label={t("Base")}
          data-wd-key="function-base"
        >
          <div className="maputnik-data-spec-property-input">
            <InputSpec
              fieldName={"base"}
              fieldSpec={latest.function.base as typeof latest.function.base & { type: "number" }}
              value={props.value?.base}
              onChange={(_, newValue) => changeBase(newValue as number | undefined)}
            />
          </div>
        </Block>
        <div className="maputnik-function-stop">
          <table className="maputnik-function-stop-table maputnik-function-stop-table--zoom">
            <caption>{t("Stops")}</caption>
            <thead>
              <tr>
                <th>{t("Zoom")}</th>
                <th rowSpan={2}>{t("Output value")}</th>
              </tr>
            </thead>
            <tbody>
              {zoomFields}
            </tbody>
          </table>
        </div>
        <div className="maputnik-toolbox">
          <InputButton
            className="maputnik-add-stop"
            onClick={props.onAddStop?.bind(null)}
          >
            <PiListPlusBold style={{ verticalAlign: "text-bottom" }} />
            {t("Add stop")}
          </InputButton>
          <InputButton
            className="maputnik-add-stop"
            data-wd-key="convert-to-expression"
            onClick={props.onExpressionClick?.bind(null)}
          >
            <TbMathFunction style={{ verticalAlign: "text-bottom" }} />
            {t("Convert to expression")}
          </InputButton>
        </div>
      </div>
    </fieldset>
  </div>;
};

export const ZoomProperty = withTranslation()(ZoomPropertyInternal);
