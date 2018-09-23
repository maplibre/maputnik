import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button'
import SpecField from './SpecField'
import NumberInput from '../inputs/NumberInput'
import InputBlock from '../inputs/InputBlock'

import DeleteStopButton from './_DeleteStopButton'
import labelFromFieldName from './_labelFromFieldName'

import docUid from '../../libs/document-uid'
import sortNumerically from '../../libs/sort-numerically'


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
    const zoomFields = this.props.value.stops.map((stop, idx) => {
      const zoomLevel = stop[0]
      const key  = this.state.refs[idx];
      const value = stop[1]
      const deleteStopBtn= <DeleteStopButton onClick={this.props.onDeleteStop.bind(this, idx)} />

      return <InputBlock
        key={key}
        doc={this.props.fieldSpec.doc}
        label={labelFromFieldName(this.props.fieldName)}
        action={deleteStopBtn}
      >
        <div>
          <div className="maputnik-zoom-spec-property-stop-edit">
            <NumberInput
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
      </InputBlock>
    });

    return <div className="maputnik-zoom-spec-property">
      {zoomFields}
      <Button
        className="maputnik-add-stop"
        onClick={this.props.onAddStop.bind(this)}
      >
        Add stop
      </Button>
    </div>
  }
}
