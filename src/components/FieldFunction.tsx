import React from 'react'

import SpecProperty from './_SpecProperty'
import DataProperty, { Stop } from './_DataProperty'
import ZoomProperty from './_ZoomProperty'
import ExpressionProperty from './_ExpressionProperty'
import {function as styleFunction} from '@maplibre/maplibre-gl-style-spec';
import {findDefaultFromSpec} from '../libs/spec-helper';


function isLiteralExpression(value: any) {
  return (Array.isArray(value) && value.length === 2 && value[0] === "literal");
}

function isGetExpression(value: any) {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value[0] === "get"
  );
}

function isZoomField(value: any) {
  return (
    typeof(value) === 'object' &&
    value.stops &&
    typeof(value.property) === 'undefined' &&
    Array.isArray(value.stops) &&
    value.stops.length > 1 &&
    value.stops.every((stop: Stop) => {
      return (
        Array.isArray(stop) &&
        stop.length === 2
      );
    })
  );
}

function isIdentityProperty(value: any) {
  return (
    typeof(value) === 'object' &&
    value.type === "identity" &&
    Object.prototype.hasOwnProperty.call(value, "property")
  );
}

function isDataStopProperty(value: any) {
  return (
    typeof(value) === 'object' &&
    value.stops &&
    typeof(value.property) !== 'undefined' &&
    value.stops.length > 1 &&
    Array.isArray(value.stops) &&
    value.stops.every((stop: Stop) => {
      return (
        Array.isArray(stop) &&
        stop.length === 2 &&
        typeof(stop[0]) === 'object'
      );
    })
  );
}

function isDataField(value: any) {
  return (
    isIdentityProperty(value) ||
    isDataStopProperty(value)
  );
}

function isPrimative(value: any): value is string | boolean | number {
  const valid = ["string", "boolean", "number"];
  return valid.includes(typeof(value));
}

function isArrayOfPrimatives(values: any): values is Array<string | boolean | number> {
  if (Array.isArray(values)) {
    return values.every(isPrimative);
  }
  return false;
}

function getDataType(value: any, fieldSpec={} as any) {
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


type FieldFunctionProps = {
  onChange(fieldName: string, value: any): unknown
  fieldName: string
  fieldType: string
  fieldSpec: any
  errors?: {[key: string]: {message: string}}
  value?: any
};


/** Supports displaying spec field for zoom function objects
 * https://www.mapbox.com/mapbox-gl-style-spec/#types-function-zoom-property
 */
const FieldFunction: React.FC<FieldFunctionProps> = (props) => {
  const [dataType, setDataType] = React.useState(
    getDataType(props.value, props.fieldSpec)
  );
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    if (!isEditing) {
      setDataType(getDataType(props.value, props.fieldSpec));
    }
  }, [props.value, props.fieldSpec, isEditing]);

  const getFieldFunctionType = (fieldSpec: any) => {
    if (fieldSpec.expression.interpolated) {
      return 'exponential';
    }
    if (fieldSpec.type === 'number') {
      return 'interval';
    }
    return 'categorical';
  };

  const addStop = () => {
    const stops = props.value.stops.slice(0);
    const lastStop = stops[stops.length - 1];
    if (typeof lastStop[0] === 'object') {
      stops.push([
        { zoom: lastStop[0].zoom + 1, value: lastStop[0].value },
        lastStop[1],
      ]);
    } else {
      stops.push([lastStop[0] + 1, lastStop[1]]);
    }

    const changedValue = {
      ...props.value,
      stops: stops,
    };

    props.onChange(props.fieldName, changedValue);
  };

  const deleteExpression = () => {
    const { fieldSpec, fieldName } = props;
    props.onChange(fieldName, fieldSpec.default);
    setDataType('value');
  };

  const deleteStop = (stopIdx: number) => {
    const stops = props.value.stops.slice(0);
    stops.splice(stopIdx, 1);

    let changedValue: any = {
      ...props.value,
      stops: stops,
    };

    if (stops.length === 1) {
      changedValue = stops[0][1];
    }

    props.onChange(props.fieldName, changedValue);
  };

  const makeZoomFunction = () => {
    const { value } = props;

    let zoomFunc: any;
    if (typeof value === 'object') {
      if (value.stops) {
        zoomFunc = {
          base: value.base,
          stops: value.stops.map((stop: Stop) => {
            return [stop[0].zoom, stop[1] || findDefaultFromSpec(props.fieldSpec)];
          }),
        };
      } else {
        zoomFunc = {
          base: value.base,
          stops: [
            [6, findDefaultFromSpec(props.fieldSpec)],
            [10, findDefaultFromSpec(props.fieldSpec)],
          ],
        };
      }
    } else {
      zoomFunc = {
        stops: [
          [6, value || findDefaultFromSpec(props.fieldSpec)],
          [10, value || findDefaultFromSpec(props.fieldSpec)],
        ],
      };
    }

    props.onChange(props.fieldName, zoomFunc);
  };

  const undoExpression = () => {
    const { value, fieldName } = props;

    if (isGetExpression(value)) {
      props.onChange(fieldName, {
        type: 'identity',
        property: value[1],
      });
      setDataType('value');
    } else if (isLiteralExpression(value)) {
      props.onChange(fieldName, value[1]);
      setDataType('value');
    }
  };

  const canUndo = () => {
    const { value, fieldSpec } = props;
    return (
      isGetExpression(value) ||
      isLiteralExpression(value) ||
      isPrimative(value) ||
      (Array.isArray(value) && fieldSpec.type === 'array')
    );
  };

  const makeExpression = () => {
    const { value, fieldSpec } = props;
    let expression;

    if (typeof value === 'object' && 'stops' in value) {
      expression = styleFunction.convertFunction(value, fieldSpec);
    } else if (isIdentityProperty(value)) {
      expression = ['get', value.property];
    } else {
      expression = ['literal', value || props.fieldSpec.default];
    }
    props.onChange(props.fieldName, expression);
  };

  const makeDataFunction = () => {
    const functionType = getFieldFunctionType(props.fieldSpec);
    const stopValue = functionType === 'categorical' ? '' : 0;
    const { value } = props;
    let dataFunc;

    if (typeof value === 'object') {
      if (value.stops) {
        dataFunc = {
          property: '',
          type: functionType,
          base: value.base,
          stops: value.stops.map((stop: Stop) => {
            return [{ zoom: stop[0], value: stopValue }, stop[1] || findDefaultFromSpec(props.fieldSpec)];
          }),
        };
      } else {
        dataFunc = {
          property: '',
          type: functionType,
          base: value.base,
          stops: [
            [{ zoom: 6, value: stopValue }, findDefaultFromSpec(props.fieldSpec)],
            [{ zoom: 10, value: stopValue }, findDefaultFromSpec(props.fieldSpec)],
          ],
        };
      }
    } else {
      dataFunc = {
        property: '',
        type: functionType,
        base: value.base,
        stops: [
          [{ zoom: 6, value: stopValue }, props.value || findDefaultFromSpec(props.fieldSpec)],
          [{ zoom: 10, value: stopValue }, props.value || findDefaultFromSpec(props.fieldSpec)],
        ],
      };
    }

    props.onChange(props.fieldName, dataFunc);
  };

  const onMarkEditing = () => {
    setIsEditing(true);
  };

  const onUnmarkEditing = () => {
    setIsEditing(false);
  };

  const propClass =
    props.fieldSpec.default === props.value ? 'maputnik-default-property' : 'maputnik-modified-property';

  let specField;

  if (dataType === 'expression') {
    specField = (
      <ExpressionProperty
        errors={props.errors}
        onChange={props.onChange.bind(null, props.fieldName)}
        canUndo={canUndo}
        onUndo={undoExpression}
        onDelete={deleteExpression}
        fieldType={props.fieldType}
        fieldName={props.fieldName}
        fieldSpec={props.fieldSpec}
        value={props.value}
        onFocus={onMarkEditing}
        onBlur={onUnmarkEditing}
      />
    );
  } else if (dataType === 'zoom_function') {
    specField = (
      <ZoomProperty
        errors={props.errors}
        onChange={props.onChange.bind(null)}
        fieldType={props.fieldType}
        fieldName={props.fieldName}
        fieldSpec={props.fieldSpec}
        value={props.value}
        onDeleteStop={deleteStop}
        onAddStop={addStop}
        onChangeToDataFunction={makeDataFunction}
        onExpressionClick={makeExpression}
      />
    );
  } else if (dataType === 'data_function') {
    specField = (
      <DataProperty
        errors={props.errors}
        onChange={props.onChange.bind(null)}
        fieldType={props.fieldType}
        fieldName={props.fieldName}
        fieldSpec={props.fieldSpec}
        value={props.value}
        onDeleteStop={deleteStop}
        onAddStop={addStop}
        onChangeToZoomFunction={makeZoomFunction}
        onExpressionClick={makeExpression}
      />
    );
  } else {
    specField = (
      <SpecProperty
        errors={props.errors}
        onChange={props.onChange.bind(null)}
        fieldType={props.fieldType}
        fieldName={props.fieldName}
        fieldSpec={props.fieldSpec}
        value={props.value}
        onZoomClick={makeZoomFunction}
        onDataClick={makeDataFunction}
        onExpressionClick={makeExpression}
      />
    );
  }

  return (
    <div className={propClass} data-wd-key={'spec-field-container:' + props.fieldName}>
      {specField}
    </div>
  );
};

export default FieldFunction;
