import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button'
import SpecField from './SpecField'
import NumberInput from '../inputs/NumberInput'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import DocLabel from './DocLabel'
import InputBlock from '../inputs/InputBlock'
import docUid from '../../libs/document-uid'
import sortNumerically from '../../libs/sort-numerically'

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
    fieldName: PropTypes.string,
    fieldSpec: PropTypes.object,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.array
    ]),
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
      return ["categorical", "interval", "exponential"]
    }
    else {
      return ["categorical", "interval"]
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

  changeStop(changeIdx, stopData, value) {
    const stops = this.props.value.stops.slice(0)
    const changedStop = stopData.zoom === undefined ? stopData.value : stopData
    stops[changeIdx] = [changedStop, value]

    const orderedStops = this.orderStopsByZoom(stops);

    const changedValue = {
      ...this.props.value,
      stops: orderedStops,
    }
    this.props.onChange(this.props.fieldName, changedValue)
  }

  changeDataProperty(propName, propVal) {
    if (propVal) {
      this.props.value[propName] = propVal
    }
    else {
      delete this.props.value[propName]
    }
    this.props.onChange(this.props.fieldName, this.props.value)
  }

  render() {
    if (typeof this.props.value.type === "undefined") {
      this.props.value.type = this.getFieldFunctionType(this.props.fieldSpec)
    }

    const dataFields = this.props.value.stops.map((stop, idx) => {
      const zoomLevel = typeof stop[0] === 'object' ? stop[0].zoom : undefined;
      const key  = this.state.refs[idx];
      const dataLevel = typeof stop[0] === 'object' ? stop[0].value : stop[0];
      const value = stop[1]
      const deleteStopBtn = <DeleteStopButton onClick={this.props.onDeleteStop.bind(this, idx)} />

      const dataProps = {
        label: "Data value",
        value: dataLevel,
        onChange: newData => this.changeStop(idx, { zoom: zoomLevel, value: newData }, value)
      }

      let dataInput;
      if(this.props.value.type === "categorical") {
        dataInput = <StringInput {...dataProps} />
      }
      else {
        dataInput = <NumberInput {...dataProps} />
      }

      let zoomInput = null;
      if(zoomLevel !== undefined) {
        zoomInput = <div className="maputnik-data-spec-property-stop-edit">
          <NumberInput
            value={zoomLevel}
            onChange={newZoom => this.changeStop(idx, {zoom: newZoom, value: dataLevel}, value)}
            min={0}
            max={22}
          />
        </div>
      }

      return <InputBlock key={key} action={deleteStopBtn} label="">
        {zoomInput}
        <div className="maputnik-data-spec-property-stop-data">
          {dataInput}
        </div>
        <div className="maputnik-data-spec-property-stop-value">
          <SpecField
            fieldName={this.props.fieldName}
            fieldSpec={this.props.fieldSpec}
            value={value}
            onChange={(_, newValue) => this.changeStop(idx, {zoom: zoomLevel, value: dataLevel}, newValue)}
          />
        </div>
      </InputBlock>
    })

    return <div className="maputnik-data-spec-block">
    <div className="maputnik-data-spec-property">
      <InputBlock
        doc={this.props.fieldSpec.doc}
        label={labelFromFieldName(this.props.fieldName)}
      >
        <div className="maputnik-data-spec-property-group">
          <DocLabel
            label="Property"
            doc={"Input a data property to base styles off of."}
          />
          <div className="maputnik-data-spec-property-input">
            <StringInput
              value={this.props.value.property}
              onChange={propVal => this.changeDataProperty("property", propVal)}
            />
          </div>
        </div>
        <div className="maputnik-data-spec-property-group">
          <DocLabel
            label="Type"
            doc={"Select a type of data scale (default is 'categorical')."}
          />
          <div className="maputnik-data-spec-property-input">
            <SelectInput
              value={this.props.value.type}
              onChange={propVal => this.changeDataProperty("type", propVal)}
              options={this.getDataFunctionTypes(this.props.fieldSpec)}
            />
          </div>
        </div>
        <div className="maputnik-data-spec-property-group">
          <DocLabel
            label="Default"
            doc={"Input a default value for data if not covered by the scales."}
          />
          <div className="maputnik-data-spec-property-input">
            <SpecField
              fieldName={this.props.fieldName}
              fieldSpec={this.props.fieldSpec}
              value={this.props.value.default}
              onChange={(_, propVal) => this.changeDataProperty("default", propVal)}
            />
          </div>
        </div>
      </InputBlock>
    </div>
      {dataFields}
      <Button
        className="maputnik-add-stop"
        onClick={this.props.onAddStop.bind(this)}
      >
        Add stop
      </Button>
    </div>
  }
}
