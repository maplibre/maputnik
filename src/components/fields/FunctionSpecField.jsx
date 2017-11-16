import React from 'react'
import Color from 'color'

import Button from '../Button'
import SpecField from './SpecField'
import NumberInput from '../inputs/NumberInput'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import DocLabel from './DocLabel'
import InputBlock from '../inputs/InputBlock'

import AddIcon from 'react-icons/lib/md/add-circle-outline'
import DeleteIcon from 'react-icons/lib/md/delete'
import FunctionIcon from 'react-icons/lib/md/functions'
import MdInsertChart from 'react-icons/lib/md/insert-chart'

import PropTypes from 'prop-types'
import capitalize from 'lodash.capitalize'

function isZoomField(value) {
  return typeof value === 'object' && value.stops && typeof value.property === 'undefined'
}

function isDataField(value) {
  return typeof value === 'object' && value.stops && typeof value.property !== 'undefined'
}

/** Supports displaying spec field for zoom function objects
 * https://www.mapbox.com/mapbox-gl-style-spec/#types-function-zoom-property
 */
export default class FunctionSpecProperty  extends React.Component {
  static propTypes = {
      onChange: PropTypes.func.isRequired,
      fieldName: PropTypes.string.isRequired,
      fieldSpec: PropTypes.object.isRequired,

      value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.array
    ]),
  }

  addStop() {
    const stops = this.props.value.stops.slice(0)
    const lastStop = stops[stops.length - 1]
    if (typeof lastStop[0] === "object") {
      stops.push([
        {zoom: lastStop[0].zoom + 1, value: lastStop[0].value},
        lastStop[1]
      ])
    }
    else {
      stops.push([lastStop[0] + 1, lastStop[1]])
    }

    const changedValue = {
      ...this.props.value,
      stops: stops,
    }

    this.props.onChange(this.props.fieldName, changedValue)
  }

  deleteStop(stopIdx) {
    const stops = this.props.value.stops.slice(0)
    stops.splice(stopIdx, 1)

    let changedValue = {
      ...this.props.value,
      stops: stops,
    }

    if(stops.length === 1) {
      changedValue = stops[0][1]
    }

    this.props.onChange(this.props.fieldName, changedValue)
  }

  makeZoomFunction() {
    const zoomFunc = {
      stops: [
        [6, this.props.value],
        [10, this.props.value]
      ]
    }
    this.props.onChange(this.props.fieldName, zoomFunc)
  }

  getFieldFunctionType(fieldSpec) {
    if (fieldSpec.function === "interpolated") {
      return "exponential"
    }
    if (fieldSpec.type === "number") {
      return "interval"
    }
    return "categorical"
  }

  getDataFunctionTypes(functionType) {
    if (functionType === "interpolated") {
      return ["categorical", "interval", "exponential"]
    }
    else {
      return ["categorical", "interval"]
    }
  }

  makeDataFunction() {
    const dataFunc = {
      property: "",
      type: "categorical",
      stops: [
        [{zoom: 6, value: 0}, this.props.value],
        [{zoom: 10, value: 0}, this.props.value]
      ]
    }
    this.props.onChange(this.props.fieldName, dataFunc)
  }

  changeStop(changeIdx, stopData, value) {
    const stops = this.props.value.stops.slice(0)
    stops[changeIdx] = [stopData, value]
    const changedValue = {
      ...this.props.value,
      stops: stops,
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

  renderDataProperty() {
    if (typeof this.props.value.type === "undefined") {
      this.props.value.type = this.getFieldFunctionType(this.props.fieldSpec)
    }
    const dataFields = this.props.value.stops.map((stop, idx) => {
      const zoomLevel = stop[0].zoom
      const dataLevel = stop[0].value
      const value = stop[1]
      const deleteStopBtn = <DeleteStopButton onClick={this.deleteStop.bind(this, idx)} />

      const dataProps = {
        label: "Data value",
        value: dataLevel,
        onChange: newData => this.changeStop(idx, { zoom: zoomLevel, value: newData }, value)
      }
      const dataInput = this.props.value.type === "categorical" ? <StringInput {...dataProps} /> : <NumberInput {...dataProps} />

      return <InputBlock key={idx} action={deleteStopBtn}>
        <div className="maputnik-data-spec-property-stop-edit">
          <NumberInput
            value={zoomLevel}
            onChange={newZoom => this.changeStop(idx, {zoom: newZoom, value: dataLevel}, value)}
            min={0}
            max={22}
          />
        </div>
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
              options={this.getDataFunctionTypes(this.props.fieldSpec.function)}
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
        onClick={this.addStop.bind(this)}
      >
        Add stop
      </Button>
    </div>
  }

  renderZoomProperty() {
    const zoomFields = this.props.value.stops.map((stop, idx) => {
      const zoomLevel = stop[0]
      const value = stop[1]
      const deleteStopBtn= <DeleteStopButton onClick={this.deleteStop.bind(this, idx)} />

      return <InputBlock
        key={zoomLevel}
        doc={this.props.fieldSpec.doc}
        label={labelFromFieldName(this.props.fieldName)}
        action={deleteStopBtn}
      >
        <div>
          <div className="maputnik-zoom-spec-property-stop-edit">
            <NumberInput
              value={zoomLevel}
              onChange={changedStop => this.changeStop(idx, changedStop, value)}
              min={0}
              max={22}
            />
          </div>
          <div className="maputnik-zoom-spec-property-stop-value">
            <SpecField
              fieldName={this.props.fieldName}
              fieldSpec={this.props.fieldSpec}
              value={value}
              onChange={(_, newValue) => this.changeStop(idx, zoomLevel, newValue)}
            />
          </div>
        </div>
      </InputBlock>
    })

    return <div className="maputnik-zoom-spec-property">
      {zoomFields}
      <Button
        className="maputnik-add-stop"
        onClick={this.addStop.bind(this)}
      >
        Add stop
      </Button>
    </div>
  }

  renderProperty() {
    const functionBtn = <MakeFunctionButtons
      fieldSpec={this.props.fieldSpec}
      onZoomClick={this.makeZoomFunction.bind(this)}
      onDataClick={this.makeDataFunction.bind(this)} 
    />
    return <InputBlock
      doc={this.props.fieldSpec.doc}
      label={labelFromFieldName(this.props.fieldName)}
      action={functionBtn}
    >
      <SpecField {...this.props} />
    </InputBlock>
  }

  render() {
    const propClass = this.props.fieldSpec.default === this.props.value ? "maputnik-default-property" : "maputnik-modified-property"
    let specField
    if (isZoomField(this.props.value)) {
      specField = this.renderZoomProperty()
    }
    else if (isDataField(this.props.value)) {
      specField = this.renderDataProperty()
    }
    else {
      specField = this.renderProperty()
    }
    return <div className={propClass}>
      {specField}
    </div>
  }
}

class MakeFunctionButtons extends React.Component {
  static propTypes = {
    fieldSpec: PropTypes.object,
    onZoomClick: PropTypes.func,
    onDataClick: PropTypes.func,
  }

  render() {
    let makeZoomButton, makeDataButton
    if (this.props.fieldSpec['zoom-function']) {
      makeZoomButton = <Button
        className="maputnik-make-zoom-function"
        onClick={this.props.onZoomClick}
      >
        <DocLabel
          label={<FunctionIcon />}
          cursorTargetStyle={{ cursor: 'pointer' }}
          doc={"Turn property into a zoom function to enable a map feature to change with map's zoom level."}
        />
      </Button>

      if (this.props.fieldSpec['property-function'] && ['piecewise-constant', 'interpolated'].indexOf(this.props.fieldSpec['function']) !== -1) {
        makeDataButton = <Button
          className="maputnik-make-data-function"
          onClick={this.props.onDataClick}
        >
          <DocLabel
            label={<MdInsertChart />}
            cursorTargetStyle={{ cursor: 'pointer' }}
            doc={"Turn property into a data function to enable a map feature to change according to data properties and the map's zoom level."}
          />
        </Button>
      }
      return <div>{makeDataButton}{makeZoomButton}</div>
    }
    else {
      return null
    }
  }
}

class DeleteStopButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
  }

  render() {
    return <Button
      className="maputnik-delete-stop"
      onClick={this.props.onClick}
    >
      <DocLabel
        label={<DeleteIcon />}
        doc={"Remove zoom level stop."}
      />
    </Button>
  }
}

function labelFromFieldName(fieldName) {
  let label = fieldName.split('-').slice(1).join(' ')
  return capitalize(label)
}
