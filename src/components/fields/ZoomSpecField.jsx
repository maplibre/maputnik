import React from 'react'
import Color from 'color'

import Button from '../Button'
import SpecField from './SpecField'
import NumberInput from '../inputs/NumberInput'
import DocLabel from './DocLabel'
import InputBlock from '../inputs/InputBlock'

import AddIcon from 'react-icons/lib/md/add-circle-outline'
import DeleteIcon from 'react-icons/lib/md/delete'
import FunctionIcon from 'react-icons/lib/md/functions'

import capitalize from 'lodash.capitalize'

let REF = 0;
function getUniqueRef() {
  return "r"+REF++;
}

function isZoomField(value) {
  return typeof value === 'object' && value.stops
}

/** Supports displaying spec field for zoom function objects
 * https://www.mapbox.com/mapbox-gl-style-spec/#types-function-zoom-property
 */
export default class ZoomSpecProperty  extends React.Component {
  static propTypes = {
      onChange: React.PropTypes.func.isRequired,
      fieldName: React.PropTypes.string.isRequired,
      fieldSpec: React.PropTypes.object.isRequired,

      value: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.bool,
      React.PropTypes.array
    ]),
  }

  constructor() {
    super()
    this.state = {
      refs: {}
    }
  }

  /**
   * We cache a reference to the zoom level to use as a key in the react dom.
   *
   * We update the reference when a stop changed its zoom level. This way input focus is maintained.
   */
  _setStopRefs(props) {
    // This is initialsed below only if required to improved performance.
    let newRefs;

    if(props.value && props.value.stops) {
      props.value.stops.forEach((val) => {
        const zoomKey = val[0];

        if(!this.state.refs.hasOwnProperty(zoomKey)) {
          if(!newRefs) {
            newRefs = {...this.state.refs};
          }
          newRefs[zoomKey] = getUniqueRef();
        }
      })
    }

    if(newRefs) {
      this.setState({
        refs: newRefs
      })
    }
  }

  _transferStopRef(oldZoomLevel, newZoomLevel) {
    let refs = this.state.refs;
    let oldRef = refs[oldZoomLevel];
    delete refs[oldZoomLevel];

    refs[newZoomLevel] = oldRef;
    this.setState({
      refs: refs
    })
  }


  componentWillReceiveProps(nextProps) {
    this._setStopRefs(nextProps);
  }

  addStop() {
    const stops = this.props.value.stops.slice(0)
    const lastStop = stops[stops.length - 1]
    stops.push([lastStop[0] + 1, lastStop[1]])

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

  sortNumerically(a, b) {
    a = parseFloat(a, 10);
    b = parseFloat(b, 10);

    if(a < b) {
      return -1
    }
    else if(a > b) {
      return 1
    }
    else {
      return 0;
    }
  }

  changeStop(changeIdx, newZoomLevel, value) {
    const stops = this.props.value.stops.slice(0)
    const oldZoomLevel = stops[changeIdx][0];

    this._transferStopRef(oldZoomLevel, newZoomLevel);

    stops[changeIdx] = [newZoomLevel, value]
    const changedValue = {
      ...this.props.value,
      stops: stops.sort((a, b) => this.sortNumerically(a[0], b[0]))
    }
    this.props.onChange(this.props.fieldName, changedValue)
  }

  renderZoomProperty() {
    const zoomFields = this.props.value.stops.map((stop, idx) => {
      const zoomLevel = stop[0]
      const key  = this.state.refs[zoomLevel];
      const value = stop[1]
      const deleteStopBtn= <DeleteStopButton onClick={this.deleteStop.bind(this, idx)} />

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
    let zoomBtn = null
    if(this.props.fieldSpec['zoom-function']) {
      zoomBtn = <MakeZoomFunctionButton onClick={this.makeZoomFunction.bind(this)} />
    }
    return <InputBlock
      doc={this.props.fieldSpec.doc}
      label={labelFromFieldName(this.props.fieldName)}
      action={zoomBtn}
    >
      <SpecField {...this.props} />
    </InputBlock>
  }

  render() {
    const propClass = this.props.fieldSpec.default === this.props.value ? "maputnik-default-property" : "maputnik-modified-property"
    return <div className={propClass}>
      {isZoomField(this.props.value) ? this.renderZoomProperty() : this.renderProperty()}
    </div>
  }
}

function MakeZoomFunctionButton(props) {
  return <Button
    className="maputnik-make-zoom-function"
    onClick={props.onClick}
  >
    <DocLabel
      label={<FunctionIcon />}
      cursorTargetStyle={{ cursor: 'pointer' }}
      doc={"Turn property into a zoom function to enable a map feature to change with map's zoom level."}
    />
  </Button>
}

function DeleteStopButton(props) {
  return <Button
    className="maputnik-delete-stop"
    onClick={props.onClick}
  >
    <DocLabel
      label={<DeleteIcon />}
      doc={"Remove zoom level stop."}
    />
  </Button>
}

function labelFromFieldName(fieldName) {
  let label = fieldName.split('-').slice(1).join(' ')
  return capitalize(label)
}
