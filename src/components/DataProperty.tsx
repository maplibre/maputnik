import React, { useRef } from "react";
import {PiListPlusBold} from "react-icons/pi";
import {TbMathFunction} from "react-icons/tb";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";

import { InputButton } from "./InputButton";
import { InputSpec } from "./InputSpec";
import { InputNumber } from "./InputNumber";
import { InputString } from "./InputString";
import { InputSelect } from "./InputSelect";
import { Block } from "./Block";
import { generateUniqueId as docUid } from "../libs/document-uid";
import { sortNumerically } from "../libs/sort-numerically";
import {findDefaultFromSpec} from "../libs/spec-helper";
import { type WithTranslation, withTranslation } from "react-i18next";

import { labelFromFieldName } from "../libs/label-from-field-name";
import { DeleteStopButton } from "./DeleteStopButton";
import { type MappedLayerErrors } from "../libs/definitions";



function setStopRefs(props: DataPropertyInternalProps, state: DataPropertyState) {
  // This is initialised below only if required to improved performance.
  let newRefs: {[key: number]: string} | undefined;

  if(props.value && props.value.stops) {
    props.value.stops.forEach((_val, idx) => {
      if(!Object.prototype.hasOwnProperty.call(state.refs, idx)) {
        if(!newRefs) {
          newRefs = {...state};
        }
        newRefs[idx] = docUid("stop-");
      }
    });
  }

  return newRefs;
}

type DataPropertyInternalProps = {
  onChange?(fieldName: string, value: any): unknown
  onDeleteStop?(...args: unknown[]): unknown
  onAddStop?(...args: unknown[]): unknown
  onExpressionClick?(...args: unknown[]): unknown
  onChangeToZoomFunction?(...args: unknown[]): unknown
  fieldName: string
  fieldType?: string
  fieldSpec?: object
  value?: DataPropertyValue
  errors?: MappedLayerErrors
} & WithTranslation;

type DataPropertyState = {
  refs: {[key: number]: string}
};

type DataPropertyValue = {
  default?: any
  property?: string
  base?: number
  type?: string
  stops: Stop[]
};

export type Stop = [{
  zoom: number
  value: number
}, number];

const DataPropertyInternal: React.FC<DataPropertyInternalProps> = (props) => {
  // Kept in a ref rather than state: the original recomputed these on every
  // render via getDerivedStateFromProps, which as state would mean setting
  // state during render on every pass.
  const refs = useRef<{[key: number]: string}>({});
  // setStopRefs returns undefined when no new stop needs a ref; as in the
  // original, only replace the map when it actually produced one.
  const newStopRefs = setStopRefs(props, { refs: refs.current });
  if (newStopRefs) {
    refs.current = newStopRefs;
  }

  function getFieldFunctionType(fieldSpec: any) {
    if (fieldSpec.expression.interpolated) {
      return "exponential";
    }
    if (fieldSpec.type === "number") {
      return "interval";
    }
    return "categorical";
  }

  function getDataFunctionTypes(fieldSpec: any) {
    if (fieldSpec.expression.interpolated) {
      return ["interpolate", "categorical", "interval", "exponential", "identity"];
    }
    else {
      return ["categorical", "interval", "identity"];
    }
  }

  // Order the stops altering the refs to reflect their new position.
  function orderStopsByZoom(stops: Stop[]) {
    const mappedWithRef = stops
      .map((stop, idx) => {
        return {
          ref: refs.current[idx],
          data: stop
        };
      })
    // Sort by zoom
      .sort((a, b) => sortNumerically(a.data[0].zoom, b.data[0].zoom));

    // Fetch the new position of the stops
    const newRefs = {} as {[key: number]: string};
    mappedWithRef
      .forEach((stop, idx) =>{
        newRefs[idx] = stop.ref;
      });

    refs.current = newRefs;

    return mappedWithRef.map((item) => item.data);
  }

  const onChange = (fieldName: string, value: any) => {
    if (value.type === "identity") {
      value = {
        type: value.type,
        property: value.property,
      };
    }
    else {
      const stopValue = value.type === "categorical" ? "" : 0;
      value = {
        property: "",
        type: value.type,
        // Default props if they don't already exist.
        stops: [
          [{zoom: 6, value: stopValue}, findDefaultFromSpec(props.fieldSpec as any)],
          [{zoom: 10, value: stopValue}, findDefaultFromSpec(props.fieldSpec as any)]
        ],
        ...value,
      };
    }
    props.onChange!(fieldName, value);
  };

  function changeStop(changeIdx: number, stopData: { zoom: number | undefined, value: number }, value: number) {
    const stops = props.value?.stops.slice(0) || [];
    // const changedStop = stopData.zoom === undefined ? stopData.value : stopData
    stops[changeIdx] = [
      {
        value: stopData.value,
        zoom: (stopData.zoom === undefined) ? 0 : stopData.zoom,
      },
      value
    ];

    const orderedStops = orderStopsByZoom(stops);

    const changedValue = {
      ...props.value,
      stops: orderedStops,
    };
    onChange(props.fieldName, changedValue);
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

  function changeDataType(propVal: string) {
    if (propVal === "interpolate" && props.onChangeToZoomFunction) {
      props.onChangeToZoomFunction();
    }
    else {
      onChange(props.fieldName, {
        ...props.value,
        type: propVal,
      });
    }
  }

  function changeDataProperty(propName: "property" | "default", propVal: any) {
    if (propVal) {
      props.value![propName] = propVal;
    }
    else {
      delete props.value![propName];
    }
    onChange(props.fieldName, props.value);
  }

  const t = props.t;

  if (typeof props.value?.type === "undefined") {
    props.value!.type = getFieldFunctionType(props.fieldSpec);
  }

  let dataFields;
  if (props.value?.stops) {
    dataFields = props.value.stops.map((stop, idx) => {
      const zoomLevel = typeof stop[0] === "object" ? stop[0].zoom : undefined;
      const key  = refs.current[idx];
      const dataLevel = typeof stop[0] === "object" ? stop[0].value : stop[0];
      const value = stop[1];
      const deleteStopBtn = <DeleteStopButton onClick={props.onDeleteStop?.bind(null, idx)} />;

      const dataProps = {
        "aria-label": t("Input value"),
        label: t("Data value"),
        value: dataLevel as any,
        onChange: (newData: string | number | undefined) => changeStop(idx, { zoom: zoomLevel, value: newData as number }, value)
      };

      let dataInput;
      if(props.value?.type === "categorical") {
        dataInput = <InputString {...dataProps} />;
      }
      else {
        dataInput = <InputNumber {...dataProps} />;
      }

      let zoomInput = null;
      if(zoomLevel !== undefined) {
        zoomInput = <div>
          <InputNumber
            aria-label="Zoom"
            value={zoomLevel}
            onChange={newZoom => changeStop(idx, {zoom: newZoom, value: dataLevel}, value)}
            min={0}
            max={22}
          />
        </div>;
      }

      return <tr key={key}>
        <td>
          {zoomInput}
        </td>
        <td>
          {dataInput}
        </td>
        <td>
          <InputSpec
            aria-label={t("Output value")}
            fieldName={props.fieldName}
            fieldSpec={props.fieldSpec}
            value={value}
            onChange={(_, newValue) => changeStop(idx, {zoom: zoomLevel, value: dataLevel}, newValue as number)}
          />
        </td>
        <td>
          {deleteStopBtn}
        </td>
      </tr>;
    });
  }

  return <div className="maputnik-data-spec-block">
    <fieldset className="maputnik-data-spec-property">
      <legend>{labelFromFieldName(props.fieldName)}</legend>
      <div className="maputnik-data-fieldset-inner">
        <Block
          label={t("Function")}
          key="function"
          data-wd-key="function-type"
        >
          <div className="maputnik-data-spec-property-input">
            <InputSelect
              value={props.value!.type}
              onChange={(propVal: string) => changeDataType(propVal)}
              title={t("Select a type of data scale (default is 'categorical').")}
              options={getDataFunctionTypes(props.fieldSpec)}
            />
          </div>
        </Block>
        {props.value?.type !== "identity" &&
            <Block
              label={t("Base")}
              key="base"
              data-wd-key="function-base"
            >
              <div className="maputnik-data-spec-property-input">
                <InputSpec
                  fieldName={"base"}
                  fieldSpec={latest.function.base as typeof latest.function.base & { type: "number" }}
                  value={props.value?.base}
                  onChange={(_, newValue) => changeBase(newValue as number)}
                />
              </div>
            </Block>
        }
        <Block
          label={"Property"}
          key="property"
          data-wd-key="function-property"
        >
          <div className="maputnik-data-spec-property-input">
            <InputString
              value={props.value?.property}
              title={t("Input a data property to base styles off of.")}
              onChange={propVal => changeDataProperty("property", propVal)}
            />
          </div>
        </Block>
        {dataFields &&
            <Block
              label={t("Default")}
              key="default"
              data-wd-key="function-default"
            >
              <InputSpec
                fieldName={props.fieldName}
                fieldSpec={props.fieldSpec}
                value={props.value?.default}
                onChange={(_, propVal) => changeDataProperty("default", propVal)}
              />
            </Block>
        }
        {dataFields &&
            <div className="maputnik-function-stop">
              <table className="maputnik-function-stop-table">
                <caption>{t("Stops")}</caption>
                <thead>
                  <tr>
                    <th>{t("Zoom")}</th>
                    <th>{t("Input value")}</th>
                    <th rowSpan={2}>{t("Output value")}</th>
                  </tr>
                </thead>
                <tbody>
                  {dataFields}
                </tbody>
              </table>
            </div>
        }
        <div className="maputnik-toolbox">
          {dataFields &&
              <InputButton
                className="maputnik-add-stop"
                onClick={props.onAddStop?.bind(null)}
              >
                <PiListPlusBold style={{ verticalAlign: "text-bottom" }} />
                {t("Add stop")}
              </InputButton>
          }
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

export const DataProperty = withTranslation()(DataPropertyInternal);
