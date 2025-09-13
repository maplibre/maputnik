import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import React from "react";
import { type WithTranslation, withTranslation } from "react-i18next";
import { PiListPlusBold } from "react-icons/pi";
import { TbMathFunction } from "react-icons/tb";
import docUid from "../libs/document-uid";
import labelFromFieldName from "../libs/label-from-field-name";
import sortNumerically from "../libs/sort-numerically";
import { findDefaultFromSpec } from "../libs/spec-helper";
import DeleteStopButton from "./_DeleteStopButton";
import Block from "./Block";
import InputButton from "./InputButton";
import InputNumber from "./InputNumber";
import InputSelect from "./InputSelect";
import InputSpec from "./InputSpec";
import InputString from "./InputString";

function setStopRefs(
  props: DataPropertyInternalProps,
  state: DataPropertyState,
) {
  // This is initialsed below only if required to improved performance.
  let newRefs: { [key: number]: string } | undefined;

  if (props.value?.stops) {
    props.value.stops.forEach((_val, idx) => {
      if (!Object.hasOwn(state.refs, idx)) {
        if (!newRefs) {
          newRefs = { ...state };
        }
        newRefs[idx] = docUid("stop-");
      }
    });
  }

  return newRefs;
}

type DataPropertyInternalProps = {
  onChange?(fieldName: string, value: any): unknown;
  onDeleteStop?(...args: unknown[]): unknown;
  onAddStop?(...args: unknown[]): unknown;
  onExpressionClick?(...args: unknown[]): unknown;
  onChangeToZoomFunction?(...args: unknown[]): unknown;
  fieldName: string;
  fieldType?: string;
  fieldSpec?: object;
  value?: DataPropertyValue;
  errors?: object;
} & WithTranslation;

type DataPropertyState = {
  refs: { [key: number]: string };
};

type DataPropertyValue = {
  default?: any;
  property?: string;
  base?: number;
  type?: string;
  stops: Stop[];
};

export type Stop = [
  {
    zoom: number;
    value: number;
  },
  number,
];

class DataPropertyInternal extends React.Component<
  DataPropertyInternalProps,
  DataPropertyState
> {
  state = {
    refs: {} as { [key: number]: string },
  };

  componentDidMount() {
    const newRefs = setStopRefs(this.props, this.state);

    if (newRefs) {
      this.setState({
        refs: newRefs,
      });
    }
  }

  static getDerivedStateFromProps(
    props: Readonly<DataPropertyInternalProps>,
    state: DataPropertyState,
  ) {
    const newRefs = setStopRefs(props, state);
    if (newRefs) {
      return {
        refs: newRefs,
      };
    }
    return null;
  }

  getFieldFunctionType(fieldSpec: any) {
    if (fieldSpec.expression.interpolated) {
      return "exponential";
    }
    if (fieldSpec.type === "number") {
      return "interval";
    }
    return "categorical";
  }

  getDataFunctionTypes(fieldSpec: any) {
    if (fieldSpec.expression.interpolated) {
      return [
        "interpolate",
        "categorical",
        "interval",
        "exponential",
        "identity",
      ];
    } else {
      return ["categorical", "interval", "identity"];
    }
  }

  // Order the stops altering the refs to reflect their new position.
  orderStopsByZoom(stops: Stop[]) {
    const mappedWithRef = stops
      .map((stop, idx) => {
        return {
          ref: this.state.refs[idx],
          data: stop,
        };
      })
      // Sort by zoom
      .sort((a, b) => sortNumerically(a.data[0].zoom, b.data[0].zoom));

    // Fetch the new position of the stops
    const newRefs = {} as { [key: number]: string };
    mappedWithRef.forEach((stop, idx) => {
      newRefs[idx] = stop.ref;
    });

    this.setState({
      refs: newRefs,
    });

    return mappedWithRef.map((item) => item.data);
  }

  onChange = (fieldName: string, value: any) => {
    if (value.type === "identity") {
      value = {
        type: value.type,
        property: value.property,
      };
    } else {
      const stopValue = value.type === "categorical" ? "" : 0;
      value = {
        property: "",
        type: value.type,
        // Default props if they don't already exist.
        stops: [
          [
            { zoom: 6, value: stopValue },
            findDefaultFromSpec(this.props.fieldSpec as any),
          ],
          [
            { zoom: 10, value: stopValue },
            findDefaultFromSpec(this.props.fieldSpec as any),
          ],
        ],
        ...value,
      };
    }
    this.props.onChange?.(fieldName, value);
  };

  changeStop(
    changeIdx: number,
    stopData: { zoom: number | undefined; value: number },
    value: number,
  ) {
    const stops = this.props.value?.stops.slice(0) || [];
    // const changedStop = stopData.zoom === undefined ? stopData.value : stopData
    stops[changeIdx] = [
      {
        value: stopData.value,
        zoom: stopData.zoom === undefined ? 0 : stopData.zoom,
      },
      value,
    ];

    const orderedStops = this.orderStopsByZoom(stops);

    const changedValue = {
      ...this.props.value,
      stops: orderedStops,
    };
    this.onChange(this.props.fieldName, changedValue);
  }

  changeBase(newValue: number | undefined) {
    const changedValue = {
      ...this.props.value,
      base: newValue,
    };

    if (changedValue.base === undefined) {
      delete changedValue.base;
    }
    this.props.onChange?.(this.props.fieldName, changedValue);
  }

  changeDataType(propVal: string) {
    if (propVal === "interpolate" && this.props.onChangeToZoomFunction) {
      this.props.onChangeToZoomFunction();
    } else {
      this.onChange(this.props.fieldName, {
        ...this.props.value,
        type: propVal,
      });
    }
  }

  changeDataProperty(propName: "property" | "default", propVal: any) {
    if (propVal) {
      this.props.value![propName] = propVal;
    } else {
      delete this.props.value?.[propName];
    }
    this.onChange(this.props.fieldName, this.props.value);
  }

  render() {
    const t = this.props.t;

    if (typeof this.props.value?.type === "undefined") {
      this.props.value!.type = this.getFieldFunctionType(this.props.fieldSpec);
    }

    let dataFields;
    if (this.props.value?.stops) {
      dataFields = this.props.value.stops.map((stop, idx) => {
        const zoomLevel =
          typeof stop[0] === "object" ? stop[0].zoom : undefined;
        const key = this.state.refs[idx];
        const dataLevel = typeof stop[0] === "object" ? stop[0].value : stop[0];
        const value = stop[1];
        const deleteStopBtn = (
          <DeleteStopButton
            onClick={this.props.onDeleteStop?.bind(this, idx)}
          />
        );

        const dataProps = {
          "aria-label": t("Input value"),
          label: t("Data value"),
          value: dataLevel as any,
          onChange: (newData: string | number | undefined) =>
            this.changeStop(
              idx,
              { zoom: zoomLevel, value: newData as number },
              value,
            ),
        };

        let dataInput;
        if (this.props.value?.type === "categorical") {
          dataInput = <InputString {...dataProps} />;
        } else {
          dataInput = <InputNumber {...dataProps} />;
        }

        let zoomInput = null;
        if (zoomLevel !== undefined) {
          zoomInput = (
            <div>
              <InputNumber
                aria-label="Zoom"
                value={zoomLevel}
                onChange={(newZoom) =>
                  this.changeStop(
                    idx,
                    { zoom: newZoom, value: dataLevel },
                    value,
                  )
                }
                min={0}
                max={22}
              />
            </div>
          );
        }

        return (
          <tr key={key}>
            <td>{zoomInput}</td>
            <td>{dataInput}</td>
            <td>
              <InputSpec
                aria-label={t("Output value")}
                fieldName={this.props.fieldName}
                fieldSpec={this.props.fieldSpec}
                value={value}
                onChange={(_, newValue) =>
                  this.changeStop(
                    idx,
                    { zoom: zoomLevel, value: dataLevel },
                    newValue as number,
                  )
                }
              />
            </td>
            <td>{deleteStopBtn}</td>
          </tr>
        );
      });
    }

    return (
      <div className="maputnik-data-spec-block">
        <fieldset className="maputnik-data-spec-property">
          <legend>{labelFromFieldName(this.props.fieldName)}</legend>
          <div className="maputnik-data-fieldset-inner">
            <Block label={t("Function")} key="function">
              <div className="maputnik-data-spec-property-input">
                <InputSelect
                  value={this.props.value?.type}
                  onChange={(propVal: string) => this.changeDataType(propVal)}
                  title={t(
                    "Select a type of data scale (default is 'categorical').",
                  )}
                  options={this.getDataFunctionTypes(this.props.fieldSpec)}
                />
              </div>
            </Block>
            {this.props.value?.type !== "identity" && (
              <Block label={t("Base")} key="base">
                <div className="maputnik-data-spec-property-input">
                  <InputSpec
                    fieldName={"base"}
                    fieldSpec={
                      latest.function.base as typeof latest.function.base & {
                        type: "number";
                      }
                    }
                    value={this.props.value?.base}
                    onChange={(_, newValue) =>
                      this.changeBase(newValue as number)
                    }
                  />
                </div>
              </Block>
            )}
            <Block label={"Property"} key="property">
              <div className="maputnik-data-spec-property-input">
                <InputString
                  value={this.props.value?.property}
                  title={t("Input a data property to base styles off of.")}
                  onChange={(propVal) =>
                    this.changeDataProperty("property", propVal)
                  }
                />
              </div>
            </Block>
            {dataFields && (
              <Block label={t("Default")} key="default">
                <InputSpec
                  fieldName={this.props.fieldName}
                  fieldSpec={this.props.fieldSpec}
                  value={this.props.value?.default}
                  onChange={(_, propVal) =>
                    this.changeDataProperty("default", propVal)
                  }
                />
              </Block>
            )}
            {dataFields && (
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
                  <tbody>{dataFields}</tbody>
                </table>
              </div>
            )}
            <div className="maputnik-toolbox">
              {dataFields && (
                <InputButton
                  className="maputnik-add-stop"
                  onClick={this.props.onAddStop?.bind(this)}
                >
                  <PiListPlusBold style={{ verticalAlign: "text-bottom" }} />
                  {t("Add stop")}
                </InputButton>
              )}
              <InputButton
                className="maputnik-add-stop"
                onClick={this.props.onExpressionClick?.bind(this)}
              >
                <TbMathFunction style={{ verticalAlign: "text-bottom" }} />
                {t("Convert to expression")}
              </InputButton>
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}

const DataProperty = withTranslation()(DataPropertyInternal);
export default DataProperty;
