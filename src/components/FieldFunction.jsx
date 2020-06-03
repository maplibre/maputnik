import React from 'react'
import PropTypes from 'prop-types'

import SpecProperty from './_SpecProperty'
import DataProperty from './_DataProperty'
import ZoomProperty from './_ZoomProperty'
import ExpressionProperty from './_ExpressionProperty'
import {function as styleFunction} from '@mapbox/mapbox-gl-style-spec';
import {findDefaultFromSpec} from '../util/spec-helper';


function isLiteralExpression (value) {
  return (Array.isArray(value) && value.length === 2 && value[0] === "literal");
}

function isGetExpression (value) {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value[0] === "get"
  );
}

function isZoomField(value) {
  return (
    typeof(value) === 'object' &&
    value.stops &&
    typeof(value.property) === 'undefined' &&
    Array.isArray(value.stops) &&
    value.stops.length > 1 &&
    value.stops.every(stop => {
      return (
        Array.isArray(stop) &&
        stop.length === 2
      );
    })
  );
}

function isIdentityProperty (value) {
  return (
    typeof(value) === 'object' &&
    value.type === "identity" &&
    value.hasOwnProperty("property")
  );
}

function isDataStopProperty (value) {
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

function isDataField(value) {
  return (
    isIdentityProperty(value) ||
    isDataStopProperty(value)
  );
}

function isPrimative (value) {
  const valid = ["string", "boolean", "number"];
  return valid.includes(typeof(value));
}

function isArrayOfPrimatives (values) {
  if (Array.isArray(values)) {
    return values.every(isPrimative);
  }
  return false;
}

function getDataType (value, fieldSpec={}) {
  if (value === undefined) {
    return "value";
  }
  else if (isPrimative(value)) {
    return "value";
  }
  else if (fieldSpec.type === "array" && isArrayOfPrimatives(value)) {
    return "value";
  }
  else if (isZoomField(value)) {
    return "zoom_function";
  }
  else if (isDataField(value)) {
    return "data_function";
  }
  else {
    return "expression";
  }
}


/** Supports displaying spec field for zoom function objects
 * https://www.mapbox.com/mapbox-gl-style-spec/#types-function-zoom-property
 */
export default class FieldFunction  extends React.Component {
  static propTypes = {
      onChange: PropTypes.func.isRequired,
      fieldName: PropTypes.string.isRequired,
      fieldType: PropTypes.string.isRequired,
      fieldSpec: PropTypes.object.isRequired,
      errors: PropTypes.object,

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
      dataType: getDataType(props.value, props.fieldSpec),
      isEditing: false,
    }
  }

  static getDerivedStateFromProps(props, state) {
    // Because otherwise when editing values we end up accidentally changing field type.
    if (state.isEditing) {
      return {};
    }
    else {
      return {
        isEditing: false,
        dataType: getDataType(props.value, props.fieldSpec)
      };
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
      dataType: "value",
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

    if (isGetExpression(value)) {
      this.props.onChange(fieldName, {
        "type": "identity",
        "property": value[1]
      });
      this.setState({
        dataType: "value",
      });
    }
    else if (isLiteralExpression(value)) {
      this.props.onChange(fieldName, value[1]);
      this.setState({
        dataType: "value",
      });
    }
  }

  canUndo = () => {
    const {value, fieldSpec} = this.props;
    return (
      isGetExpression(value) ||
      isLiteralExpression(value) ||
      isPrimative(value) ||
      (Array.isArray(value) && fieldSpec.type === "array")
    );
  }

  makeExpression = () => {
    const {value, fieldSpec} = this.props;
    let expression;

    if (typeof(value) === "object" && 'stops' in value) {
      expression = styleFunction.convertFunction(value, fieldSpec);
    }
    else if (isIdentityProperty(value)) {
      expression = ["get", value.property];
    }
    else {
      expression = ["literal", value || this.props.fieldSpec.default];
    }
    this.props.onChange(this.props.fieldName, expression);
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

  onMarkEditing = () => {
    this.setState({isEditing: true});
  }

  onUnmarkEditing = () => {
    this.setState({isEditing: false});
  }

  render() {
    const {dataType} = this.state;
    const propClass = this.props.fieldSpec.default === this.props.value ? "maputnik-default-property" : "maputnik-modified-property"
    let specField;

    if (dataType === "expression") {
      specField = (
        <ExpressionProperty
          errors={this.props.errors}
          onChange={this.props.onChange.bind(this, this.props.fieldName)}
          canUndo={this.canUndo}
          onUndo={this.undoExpression}
          onDelete={this.deleteExpression}
          fieldType={this.props.fieldType}
          fieldName={this.props.fieldName}
          fieldSpec={this.props.fieldSpec}
          value={this.props.value}
          onFocus={this.onMarkEditing}
          onBlur={this.onUnmarkEditing}
        />
      );
    }
    else if (dataType === "zoom_function") {
      specField = (
        <ZoomProperty
          errors={this.props.errors}
          onChange={this.props.onChange.bind(this)}
          fieldType={this.props.fieldType}
          fieldName={this.props.fieldName}
          fieldSpec={this.props.fieldSpec}
          value={this.props.value}
          onDeleteStop={this.deleteStop}
          onAddStop={this.addStop}
          onExpressionClick={this.makeExpression} 
        />
      )
    }
    else if (dataType === "data_function") {
      specField = (
        <DataProperty
          errors={this.props.errors}
          onChange={this.props.onChange.bind(this)}
          fieldType={this.props.fieldType}
          fieldName={this.props.fieldName}
          fieldSpec={this.props.fieldSpec}
          value={this.props.value}
          onDeleteStop={this.deleteStop}
          onAddStop={this.addStop}
          onExpressionClick={this.makeExpression} 
        />
      )
    }
    else {
      specField = (
        <SpecProperty
          errors={this.props.errors}
          onChange={this.props.onChange.bind(this)}
          fieldType={this.props.fieldType}
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

