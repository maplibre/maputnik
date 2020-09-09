import React from 'react'
import PropTypes from 'prop-types'
import {mdiFunctionVariant, mdiTableRowPlusAfter} from '@mdi/js';
import {latest} from '@mapbox/mapbox-gl-style-spec'

import InputButton from './InputButton'
import InputSpec from './InputSpec'
import InputNumber from './InputNumber'
import InputString from './InputString'
import InputSelect from './InputSelect'
import FieldDocLabel from './FieldDocLabel'
import Block from './Block'
import docUid from '../libs/document-uid'
import sortNumerically from '../libs/sort-numerically'
import {findDefaultFromSpec} from '../util/spec-helper';

import labelFromFieldName from './_labelFromFieldName'
import DeleteStopButton from './_DeleteStopButton'



function setStopRefs(props, state) {
  // This is initialsed below only if required to improved performance.
  let newRefs;

  if(props.value && props.value.stops) {
    props.value.stops.forEach((val, idx) => {
      if(!state.refs.hasOwnProperty(idx)) {
        if(!newRefs) {
          newRefs = {...state};
        }
        newRefs[idx] = docUid("stop-");
      }
    })
  }

  return newRefs;
}

export default class DataProperty extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    onDeleteStop: PropTypes.func,
    onAddStop: PropTypes.func,
    onExpressionClick: PropTypes.func,
    fieldName: PropTypes.string,
    fieldType: PropTypes.string,
    fieldSpec: PropTypes.object,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.array
    ]),
    errors: PropTypes.object,
  }

  state = {
    refs: {}
  }

  componentDidMount() {
    const newRefs = setStopRefs(this.props, this.state);

    if(newRefs) {
      this.setState({
        refs: newRefs
      })
    }
  }

  static getDerivedStateFromProps(props, state) {
    const newRefs = setStopRefs(props, state);
    if(newRefs) {
      return {
        refs: newRefs
      };
    }
    return null;
  }

  getFieldFunctionType(fieldSpec) {
    if (fieldSpec.expression.interpolated) {
      return "exponential"
    }
    if (fieldSpec.type === "number") {
      return "interval"
    }
    return "categorical"
  }

  getDataFunctionTypes(fieldSpec) {
    if (fieldSpec.expression.interpolated) {
      return ["interpolate", "categorical", "interval", "exponential", "identity"]
    }
    else {
      return ["categorical", "interval", "identity"]
    }
  }

  // Order the stops altering the refs to reflect their new position.
  orderStopsByZoom(stops) {
    const mappedWithRef = stops
      .map((stop, idx) => {
        return {
          ref: this.state.refs[idx],
          data: stop
        }
      })
      // Sort by zoom
      .sort((a, b) => sortNumerically(a.data[0].zoom, b.data[0].zoom));

    // Fetch the new position of the stops
    const newRefs = {};
    mappedWithRef
      .forEach((stop, idx) =>{
        newRefs[idx] = stop.ref;
      })

    this.setState({
      refs: newRefs
    });

    return mappedWithRef.map((item) => item.data);
  }

  onChange = (fieldName, value) => {
    if (value.type === "identity") {
      value = {
        type: value.type,
        property: value.property,
      };
    }
    else {
      const stopValue = value.type === 'categorical' ? '' : 0;
      value = {
        property: "",
        type: value.type,
        // Default props if they don't already exist.
        stops: [
          [{zoom: 6, value: stopValue}, findDefaultFromSpec(this.props.fieldSpec)],
          [{zoom: 10, value: stopValue}, findDefaultFromSpec(this.props.fieldSpec)]
        ],
        ...value,
      }
    }
    this.props.onChange(fieldName, value);
  }

  changeStop(changeIdx, stopData, value) {
    const stops = this.props.value.stops.slice(0)
    // const changedStop = stopData.zoom === undefined ? stopData.value : stopData
    stops[changeIdx] = [
      {
        ...stopData,
        zoom: (stopData.zoom === undefined) ? 0 : stopData.zoom,
      },
      value
    ];

    const orderedStops = this.orderStopsByZoom(stops);

    const changedValue = {
      ...this.props.value,
      stops: orderedStops,
    }
    this.onChange(this.props.fieldName, changedValue)
  }

  changeBase(newValue) {
    const changedValue = {
      ...this.props.value,
      base: newValue
    }

    if (changedValue.base === undefined) {
      delete changedValue["base"];
    }
    this.props.onChange(this.props.fieldName, changedValue)
  }

  changeDataType(propVal) {
    if (propVal === "interpolate") {
      this.props.onChangeToZoomFunction();
    }
    else {
      this.onChange(this.props.fieldName, {
        ...this.props.value,
        type: propVal,
      });
    }
  }

  changeDataProperty(propName, propVal) {
    if (propVal) {
      this.props.value[propName] = propVal
    }
    else {
      delete this.props.value[propName]
    }
    this.onChange(this.props.fieldName, this.props.value)
  }

  render() {
    const {fieldName, fieldType, errors} = this.props;

    if (typeof this.props.value.type === "undefined") {
      this.props.value.type = this.getFieldFunctionType(this.props.fieldSpec)
    }

    let dataFields;
    if (this.props.value.stops) {
      dataFields = this.props.value.stops.map((stop, idx) => {
        const zoomLevel = typeof stop[0] === 'object' ? stop[0].zoom : undefined;
        const key  = this.state.refs[idx];
        const dataLevel = typeof stop[0] === 'object' ? stop[0].value : stop[0];
        const value = stop[1]
        const deleteStopBtn = <DeleteStopButton onClick={this.props.onDeleteStop.bind(this, idx)} />

        const dataProps = {
          'aria-label': "Input value",
          label: "Data value",
          value: dataLevel,
          onChange: newData => this.changeStop(idx, { zoom: zoomLevel, value: newData }, value)
        }

        let dataInput;
        if(this.props.value.type === "categorical") {
          dataInput = <InputString {...dataProps} />
        }
        else {
          dataInput = <InputNumber {...dataProps} />
        }

        let zoomInput = null;
        if(zoomLevel !== undefined) {
          zoomInput = <div>
            <InputNumber
              aria-label="Zoom"
              value={zoomLevel}
              onChange={newZoom => this.changeStop(idx, {zoom: newZoom, value: dataLevel}, value)}
              min={0}
              max={22}
            />
          </div>
        }

        const errorKeyStart = `${fieldType}.${fieldName}.stops[${idx}]`;
        const foundErrors = Object.entries(errors).filter(([key, error]) => {
          return key.startsWith(errorKeyStart);
        });

        const message = foundErrors.map(([key, error]) => {
          return error.message;
        }).join("");
        const error = message ? {message} : undefined;

        return <tr key={key}>
          <td>
            {zoomInput}
          </td>
          <td>
            {dataInput}
          </td>
          <td>
            <InputSpec
              aria-label="Output value"
              fieldName={this.props.fieldName}
              fieldSpec={this.props.fieldSpec}
              value={value}
              onChange={(_, newValue) => this.changeStop(idx, {zoom: zoomLevel, value: dataLevel}, newValue)}
            />
          </td>
          <td>
            {deleteStopBtn}
          </td>
        </tr>

        return <Block
          error={error}
          key={key}
          action={deleteStopBtn}
          label=""
        >
          {zoomInput}
          <div className="maputnik-data-spec-property-stop-data">
            {dataInput}
          </div>
          <div className="maputnik-data-spec-property-stop-value">
            <InputSpec
              fieldName={this.props.fieldName}
              fieldSpec={this.props.fieldSpec}
              value={value}
              onChange={(_, newValue) => this.changeStop(idx, {zoom: zoomLevel, value: dataLevel}, newValue)}
            />
          </div>
        </Block>
      })
    }

    return <div className="maputnik-data-spec-block">
      <fieldset className="maputnik-data-spec-property">
        <legend>{labelFromFieldName(this.props.fieldName)}</legend>
        <div className="maputnik-data-fieldset-inner">
          <Block
            label={"Function"}
            key="function"
          >
            <div className="maputnik-data-spec-property-input">
              <InputSelect
                value={this.props.value.type}
                onChange={propVal => this.changeDataType(propVal)}
                title={"Select a type of data scale (default is 'categorical')."}
                options={this.getDataFunctionTypes(this.props.fieldSpec)}
              />
            </div>
          </Block>
          {this.props.value.type !== "identity" &&
            <Block
              label={"Base"}
              key="base"
            >
              <div className="maputnik-data-spec-property-input">
                <InputSpec
                  fieldName={"base"}
                  fieldSpec={latest.function.base}
                  value={this.props.value.base}
                  onChange={(_, newValue) => this.changeBase(newValue)}
                />
              </div>
            </Block>
          }
          <Block
            label={"Property"}
            key="property"
          >
            <div className="maputnik-data-spec-property-input">
              <InputString
                value={this.props.value.property}
                title={"Input a data property to base styles off of."}
                onChange={propVal => this.changeDataProperty("property", propVal)}
              />
            </div>
          </Block>
          {dataFields &&
            <Block
              label={"Default"}
              key="default"
            >
              <InputSpec
                fieldName={this.props.fieldName}
                fieldSpec={this.props.fieldSpec}
                value={this.props.value.default}
                onChange={(_, propVal) => this.changeDataProperty("default", propVal)}
              />
            </Block>
          }
          {dataFields &&
            <div className="maputnik-function-stop">
              <table className="maputnik-function-stop-table">
                <caption>Stops</caption>
                <thead>
                  <tr>
                    <th>Zoom</th>
                    <th>Input value</th>
                    <th rowSpan="2">Output value</th>
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
                onClick={this.props.onAddStop.bind(this)}
              >
                <svg style={{width:"14px", height:"14px", verticalAlign: "text-bottom"}} viewBox="0 0 24 24">
                  <path fill="currentColor" d={mdiTableRowPlusAfter} />
                </svg> Add stop
              </InputButton>
            }
            <InputButton
              className="maputnik-add-stop"
              onClick={this.props.onExpressionClick.bind(this)}
            >
              <svg style={{width:"14px", height:"14px", verticalAlign: "text-bottom"}} viewBox="0 0 24 24">
                <path fill="currentColor" d={mdiFunctionVariant} />
              </svg> Convert to expression
            </InputButton>
          </div>
        </div>
      </fieldset>
    </div>
  }
}
