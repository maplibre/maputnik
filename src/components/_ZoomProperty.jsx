import React from 'react'
import PropTypes from 'prop-types'
import {mdiFunctionVariant, mdiTableRowPlusAfter} from '@mdi/js';

import Button from './Button'
import SpecField from './SpecField'
import FieldNumber from './FieldNumber'
import Block from './Block'

import DeleteStopButton from './_DeleteStopButton'
import labelFromFieldName from './_labelFromFieldName'

import docUid from '../libs/document-uid'
import sortNumerically from '../libs/sort-numerically'


/**
 * We cache a reference for each stop by its index.
 *
 * When the stops are reordered the references are also updated (see this.orderStops) this allows React to use the same key for the element and keep keyboard focus.
 */
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


export default class ZoomProperty extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    onDeleteStop: PropTypes.func,
    onAddStop: PropTypes.func,
    onExpressionClick: PropTypes.func,
    fieldType: PropTypes.string,
    fieldName: PropTypes.string,
    fieldSpec: PropTypes.object,
    errors: PropTypes.object,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.array
    ]),
  }

  static defaultProps = {
    errors: {},
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
      .sort((a, b) => sortNumerically(a.data[0], b.data[0]));

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

  changeZoomStop(changeIdx, stopData, value) {
    const stops = this.props.value.stops.slice(0);
    stops[changeIdx] = [stopData, value];

    const orderedStops = this.orderStopsByZoom(stops);

    const changedValue = {
      ...this.props.value,
      stops: orderedStops
    }
    this.props.onChange(this.props.fieldName, changedValue)
  }

  render() {
    const {fieldName, fieldType, errors} = this.props;

    const zoomFields = this.props.value.stops.map((stop, idx) => {
      const zoomLevel = stop[0]
      const key  = this.state.refs[idx];
      const value = stop[1]
      const deleteStopBtn= <DeleteStopButton onClick={this.props.onDeleteStop.bind(this, idx)} />

      const errorKeyStart = `${fieldType}.${fieldName}.stops[${idx}]`;
      const foundErrors = Object.entries(errors).filter(([key, error]) => {
        return key.startsWith(errorKeyStart);
      });

      const message = foundErrors.map(([key, error]) => {
        return error.message;
      }).join("");
      const error = message ? {message} : undefined;

      return <Block
        error={error}
        key={key}
        fieldSpec={this.props.fieldSpec}
        label={labelFromFieldName(this.props.fieldName)}
        action={deleteStopBtn}
      >
        <div>
          <div className="maputnik-zoom-spec-property-stop-edit">
            <FieldNumber
              value={zoomLevel}
              onChange={changedStop => this.changeZoomStop(idx, changedStop, value)}
              min={0}
              max={22}
            />
          </div>
          <div className="maputnik-zoom-spec-property-stop-value">
            <SpecField
              fieldName={this.props.fieldName}
              fieldSpec={this.props.fieldSpec}
              value={value}
              onChange={(_, newValue) => this.changeZoomStop(idx, zoomLevel, newValue)}
            />
          </div>
        </div>
      </Block>
    });

    return <div className="maputnik-zoom-spec-property">
      {zoomFields}
      <Button
        className="maputnik-add-stop"
        onClick={this.props.onAddStop.bind(this)}
      >
        <svg style={{width:"14px", height:"14px", verticalAlign: "text-bottom"}} viewBox="0 0 24 24">
          <path fill="currentColor" d={mdiTableRowPlusAfter} />
        </svg> Add stop
      </Button>
      <Button
        className="maputnik-add-stop"
        onClick={this.props.onExpressionClick.bind(this)}
      >
        <svg style={{width:"14px", height:"14px", verticalAlign: "text-bottom"}} viewBox="0 0 24 24">
          <path fill="currentColor" d={mdiFunctionVariant} />
        </svg> Convert to expression
      </Button>
    </div>
  }
}
