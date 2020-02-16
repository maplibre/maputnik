import React from 'react'
import PropTypes from 'prop-types'

import SpecProperty from './_SpecProperty'
import DataProperty from './_DataProperty'
import ZoomProperty from './_ZoomProperty'
import ExpressionProperty from './_ExpressionProperty'


function isLiteralExpression (value) {
  return (Array.isArray(value) && value.length === 2 && value[0] === "literal");
}

function isZoomField(value) {
  return (
    typeof(value) === 'object' &&
    value.stops &&
    typeof(value.property) === 'undefined' &&
    Array.isArray(value.stops) &&
    value.stops.length > 1 &&
    value.stops.every(stop => Array.isArray(stop) && stop.length === 2)
  );
}

function isDataField(value) {
  return (
    typeof(value) === 'object' &&
    value.stops &&
    typeof(value.property) !== 'undefined' &&
    value.stops.length > 1 &&
    Array.isArray(value.stops) &&
    value.stops.every(stop => {
      return (
        Array.isArray(stop) &&
        stop.length === 2 &&
        typeof(stop[0]) === 'object'
      );
    })
  );
}

function isPrimative (value) {
  const valid = ["string", "boolean", "number"];
  return valid.includes(typeof(value));
}

function isArrayOfPrimatives (values) {
  if (Array.isArray(value)) {
    return values.every(isPrimative);
  }
  return false;
}

function checkIsExpression (value, fieldSpec={}) {
  if (value === undefined) {
    return false;
  }
  else if (isPrimative(value)) {
    return false;
  }
  else if (fieldSpec.type === "array" && isArrayOfPrimatives(value)) {
    return false;
  }
  else if (isZoomField(value) || isDataField(value)) {
    return false;
  }
  else {
    return true;
  }
}

/**
 * If we don't have a default value just make one up
 */
function findDefaultFromSpec (spec) {
  if (spec.hasOwnProperty('default')) {
    return spec.default;
  }

  const defaults = {
    'color': '#000000',
    'string': '',
    'boolean': false,
    'number': 0,
    'array': [],
  }

  return defaults[spec.type] || '';
}

/** Supports displaying spec field for zoom function objects
 * https://www.mapbox.com/mapbox-gl-style-spec/#types-function-zoom-property
 */
export default class FunctionSpecProperty  extends React.Component {
  static propTypes = {
      onChange: PropTypes.func.isRequired,
      fieldName: PropTypes.string.isRequired,
      fieldSpec: PropTypes.object.isRequired,
      error: PropTypes.object,

      value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.array
    ]),
  }

  constructor (props) {
    super();
    this.state = {
      isExpression: checkIsExpression(props.value, props.fieldSpec),
    }
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

  addStop = () => {
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

  deleteExpression = () => {
    const {fieldSpec, fieldName} = this.props;
    this.props.onChange(fieldName, fieldSpec.default);
    this.setState({
      isExpression: false,
    });
  }

  deleteStop = (stopIdx) => {
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

  makeZoomFunction = () => {
    const zoomFunc = {
      stops: [
        [6, this.props.value || findDefaultFromSpec(this.props.fieldSpec)],
        [10, this.props.value || findDefaultFromSpec(this.props.fieldSpec)]
      ]
    }
    this.props.onChange(this.props.fieldName, zoomFunc)
  }

  undoExpression = () => {
    const {value, fieldName} = this.props;

    if (isLiteralExpression(value)) {
     this.props.onChange(fieldName, value[1]);
     this.setState({
       isExpression: false
     });
    }
  }

  canUndo = () => {
    const {value} = this.props;
    return isLiteralExpression(value);
  }

  makeExpression = () => {
    const expression = ["literal", this.props.value || this.props.fieldSpec.default];
    this.props.onChange(this.props.fieldName, expression);

    this.setState({
      isExpression: true,
    });
  }

  makeDataFunction = () => {
    const functionType = this.getFieldFunctionType(this.props.fieldSpec);
    const stopValue = functionType === 'categorical' ? '' : 0;
    const dataFunc = {
      property: "",
      type: functionType,
      stops: [
        [{zoom: 6, value: stopValue}, this.props.value || findDefaultFromSpec(this.props.fieldSpec)],
        [{zoom: 10, value: stopValue}, this.props.value || findDefaultFromSpec(this.props.fieldSpec)]
      ]
    }
    this.props.onChange(this.props.fieldName, dataFunc)
  }

  render() {
    const propClass = this.props.fieldSpec.default === this.props.value ? "maputnik-default-property" : "maputnik-modified-property"
    let specField;

    if (this.state.isExpression) {
      specField = (
        <ExpressionProperty
          error={this.props.error}
          onChange={this.props.onChange.bind(this, this.props.fieldName)}
          canUndo={this.canUndo}
          onUndo={this.undoExpression}
          onDelete={this.deleteExpression}
          fieldName={this.props.fieldName}
          fieldSpec={this.props.fieldSpec}
          value={this.props.value}
        />
      );
    }
    else if (isZoomField(this.props.value)) {
      specField = (
        <ZoomProperty
          error={this.props.error}
          onChange={this.props.onChange.bind(this)}
          fieldName={this.props.fieldName}
          fieldSpec={this.props.fieldSpec}
          value={this.props.value}
          onDeleteStop={this.deleteStop}
          onAddStop={this.addStop}
        />
      )
    }
    else if (isDataField(this.props.value)) {
      specField = (
        <DataProperty
          error={this.props.error}
          onChange={this.props.onChange.bind(this)}
          fieldName={this.props.fieldName}
          fieldSpec={this.props.fieldSpec}
          value={this.props.value}
          onDeleteStop={this.deleteStop}
          onAddStop={this.addStop}
        />
      )
    }
    else {
      specField = (
        <SpecProperty
          error={this.props.error}
          onChange={this.props.onChange.bind(this)}
          fieldName={this.props.fieldName}
          fieldSpec={this.props.fieldSpec}
          value={this.props.value}
          onZoomClick={this.makeZoomFunction}
          onDataClick={this.makeDataFunction} 
          onExpressionClick={this.makeExpression} 
        />
      )
    }
    return <div className={propClass} data-wd-key={"spec-field:"+this.props.fieldName}>
      {specField}
    </div>
  }
}

