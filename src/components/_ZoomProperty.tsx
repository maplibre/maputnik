import React from 'react'
import {mdiFunctionVariant, mdiTableRowPlusAfter} from '@mdi/js';
import latest from '@maplibre/maplibre-gl-style-spec/dist/latest.json'
import { WithTranslation, withTranslation } from 'react-i18next';

import InputButton from './InputButton'
import InputSpec from './InputSpec'
import InputNumber from './InputNumber'
import InputSelect from './InputSelect'
import Block from './Block'

import DeleteStopButton from './_DeleteStopButton'
import labelFromFieldName from '../libs/label-from-field-name'

import docUid from '../libs/document-uid'
import sortNumerically from '../libs/sort-numerically'


/**
 * We cache a reference for each stop by its index.
 *
 * When the stops are reordered the references are also updated (see this.orderStops) this allows React to use the same key for the element and keep keyboard focus.
 */
function setStopRefs(props: ZoomPropertyInternalProps, state: ZoomPropertyState) {
  // This is initialsed below only if required to improved performance.
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
    })
  }
  return newRefs;
}

type ZoomWithStops = {
  stops: [number | undefined, number][]
  base?: number
}


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
  errors?: object
  value?: ZoomWithStops
} & WithTranslation;

type ZoomPropertyState = {
  refs: {[key: number]: string}
}

class ZoomPropertyInternal extends React.Component<ZoomPropertyInternalProps, ZoomPropertyState> {
  static defaultProps = {
    errors: {},
  }

  state = {
    refs: {} as {[key: number]: string}
  }

  componentDidMount() {
    const newRefs = setStopRefs(this.props, this.state);

    if(newRefs) {
      this.setState({
        refs: newRefs
      })
    }
  }

  static getDerivedStateFromProps(props: Readonly<ZoomPropertyInternalProps>, state: ZoomPropertyState) {
    const newRefs = setStopRefs(props, state);
    if(newRefs) {
      return {
        refs: newRefs
      };
    }
    return null;
  }

  // Order the stops altering the refs to reflect their new position.
  orderStopsByZoom(stops: ZoomWithStops["stops"]) {
    const mappedWithRef = stops
      .map((stop, idx) => {
        return {
          ref: this.state.refs[idx],
          data: stop
        }
      })
    // Sort by zoom
      .sort((a, b) => sortNumerically(a.data[0]!, b.data[0]!));

    // Fetch the new position of the stops
    const newRefs: {[key:number]: string} = {};
    mappedWithRef
      .forEach((stop, idx) =>{
        newRefs[idx] = stop.ref;
      })

    this.setState({
      refs: newRefs
    });

    return mappedWithRef.map((item) => item.data);
  }

  changeZoomStop(changeIdx: number, stopData: number | undefined, value: number) {
    const stops = (this.props.value as ZoomWithStops).stops.slice(0);
    stops[changeIdx] = [stopData, value];

    const orderedStops = this.orderStopsByZoom(stops);

    const changedValue = {
      ...this.props.value as ZoomWithStops,
      stops: orderedStops
    }
    this.props.onChange!(this.props.fieldName, changedValue)
  }

  changeBase(newValue: number | undefined) {
    const changedValue = {
      ...this.props.value,
      base: newValue
    }

    if (changedValue.base === undefined) {
      delete changedValue["base"];
    }
    this.props.onChange!(this.props.fieldName, changedValue)
  }

  changeDataType = (type: string) => {
    if (type !== "interpolate" && this.props.onChangeToDataFunction) {
      this.props.onChangeToDataFunction(type);
    }
  }

  render() {
    const t = this.props.t;
    const zoomFields = this.props.value?.stops.map((stop, idx) => {
      const zoomLevel = stop[0]
      const value = stop[1]
      const deleteStopBtn = <DeleteStopButton onClick={this.props.onDeleteStop?.bind(this, idx)} />
      return <tr
        key={`${stop[0]}-${stop[1]}`}
      >
        <td>
          <InputNumber
            aria-label={t("Zoom")}
            value={zoomLevel}
            onChange={changedStop => this.changeZoomStop(idx, changedStop, value)}
            min={0}
            max={22}
          />
        </td>
        <td>
          <InputSpec
            aria-label={t("Output value")}
            fieldName={this.props.fieldName}
            fieldSpec={this.props.fieldSpec as any}
            value={value}
            onChange={(_, newValue) => this.changeZoomStop(idx, zoomLevel, newValue as number)}
          />
        </td>
        <td>
          {deleteStopBtn}
        </td>
      </tr>
    });

    // return <div className="maputnik-zoom-spec-property">
    return <div className="maputnik-data-spec-block">
      <fieldset className="maputnik-data-spec-property">
        <legend>{labelFromFieldName(this.props.fieldName)}</legend>
        <div className="maputnik-data-fieldset-inner">
          <Block
            label={t("Function")}
          >
            <div className="maputnik-data-spec-property-input">
              <InputSelect
                value={"interpolate"}
                onChange={(propVal: string) => this.changeDataType(propVal)}
                title={t("Select a type of data scale (default is 'categorical').")}
                options={this.getDataFunctionTypes(this.props.fieldSpec!)}
              />
            </div>
          </Block>
          <Block
            label={t("Base")}
          >
            <div className="maputnik-data-spec-property-input">
              <InputSpec
                fieldName={"base"}
                fieldSpec={latest.function.base as typeof latest.function.base & { type: "number" }}
                value={this.props.value?.base}
                onChange={(_, newValue) => this.changeBase(newValue as number | undefined)}
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
              onClick={this.props.onAddStop?.bind(this)}
            >
              <svg style={{width:"14px", height:"14px", verticalAlign: "text-bottom"}} viewBox="0 0 24 24">
                <path fill="currentColor" d={mdiTableRowPlusAfter} />
              </svg> {t("Add stop")}
            </InputButton>
            <InputButton
              className="maputnik-add-stop"
              onClick={this.props.onExpressionClick?.bind(this)}
            >
              <svg style={{width:"14px", height:"14px", verticalAlign: "text-bottom"}} viewBox="0 0 24 24">
                <path fill="currentColor" d={mdiFunctionVariant} />
              </svg> {t("Convert to expression")}
            </InputButton>
          </div>
        </div>
      </fieldset>
    </div>
  }

  getDataFunctionTypes(fieldSpec: {
    "property-type"?: string
    "function-type"?: string
  }) {
    if (fieldSpec['property-type'] === 'data-driven') {
      return ["interpolate", "categorical", "interval", "exponential", "identity"];
    }
    else {
      return ["interpolate"];
    }
  }
}

const ZoomProperty = withTranslation()(ZoomPropertyInternal);
export default ZoomProperty;
