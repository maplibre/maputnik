import React from 'react'
import PropTypes from 'prop-types'
import { combiningFilterOps } from '../../libs/filterops.js'

import {latest, validate, migrate} from '@mapbox/mapbox-gl-style-spec'
import DocLabel from '../fields/DocLabel'
import SelectInput from '../inputs/SelectInput'
import InputBlock from '../inputs/InputBlock'
import SingleFilterEditor from './SingleFilterEditor'
import FilterEditorBlock from './FilterEditorBlock'
import Button from '../Button'
import SpecDoc from '../inputs/SpecDoc'
import ExpressionProperty from '../fields/_ExpressionProperty';



function migrateFilter (filter) {
  return migrate(createStyleFromFilter(filter)).layers[0].filter;
}

function createStyleFromFilter (filter) {
  return {
    "id": "tmp",
    "version": 8,
    "name": "Empty Style",
    "metadata": {"maputnik:renderer": "mbgljs"},
    "sources": {
      "tmp": {
        "type": "geojson",
        "data": {}
      }
    },
    "sprite": "",
    "glyphs": "https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf",
    "layers": [
      {
        id: "tmp",
        type: "fill",
        source: "tmp",
        filter: filter,
      },
    ],
  };
}

/**
 * This is doing way more work than we need it to, however validating a whole
 * style if the only thing that's exported from mapbox-gl-style-spec at the
 * moment. Not really an issue though as it take ~0.1ms to calculate.
 */
function checkIfSimpleFilter (filter) {
  if (!filter || !combiningFilterOps.includes(filter[0])) {
    return false;
  }

  // Because "none" isn't supported by the next expression syntax we can test
  // with ["none", ...] because it'll return false if it's a new style
  // expression.
  const moddedFilter = ["none", ...filter.slice(1)];
  const tmpStyle = createStyleFromFilter(moddedFilter)

  const errors = validate(tmpStyle);
  return (errors.length < 1);
}

function hasCombiningFilter(filter) {
  return combiningFilterOps.indexOf(filter[0]) >= 0
}

function hasNestedCombiningFilter(filter) {
  if(hasCombiningFilter(filter)) {
    const combinedFilters = filter.slice(1)
    return filter.slice(1).map(f => hasCombiningFilter(f)).filter(f => f == true).length > 0
  }
  return false
}

export default class CombiningFilterEditor extends React.Component {
  static propTypes = {
    /** Properties of the vector layer and the available fields */
    properties: PropTypes.object,
    filter: PropTypes.array,
    errors: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }

  constructor (props) {
    super();
    this.state = {
      showDoc: false,
      isSimpleFilter: checkIfSimpleFilter(this.combiningFilter(props)),
    };
  }

  // Convert filter to combining filter
  combiningFilter(props=this.props) {
    let filter = props.filter || ['all']

    let combiningOp = filter[0]
    let filters = filter.slice(1)

    if(combiningFilterOps.indexOf(combiningOp) < 0) {
      combiningOp = 'all'
      filters = [filter.slice(0)]
    }

    return [combiningOp, ...filters]
  }

  onFilterPartChanged(filterIdx, newPart) {
    const newFilter = this.combiningFilter().slice(0)
    newFilter[filterIdx] = newPart
    this.props.onChange(newFilter)
  }

  deleteFilterItem(filterIdx) {
    const newFilter = this.combiningFilter().slice(0)
    newFilter.splice(filterIdx + 1, 1)
    this.props.onChange(newFilter)
  }

  addFilterItem = () => {
    const newFilterItem = this.combiningFilter().slice(0)
    newFilterItem.push(['==', 'name', ''])
    this.props.onChange(newFilterItem)
  }

  onToggleDoc = (val) => {
    this.setState({
      showDoc: val
    });
  }

  makeExpression = () => {
    let filter = this.combiningFilter();
    this.props.onChange(migrateFilter(filter));
    this.setState({
      isSimpleFilter: false,
    })
  }

  static getDerivedStateFromProps (props, currentState) {
    const {filter} = props;
    const isSimpleFilter = checkIfSimpleFilter(props.filter);

    // Upgrade but never downgrade
    if (!isSimpleFilter && currentState.isSimpleFilter === true) {
      return {
        isSimpleFilter: false,
      };
    }
    else {
      return {};
    }
  }

  render() {
    const {errors} = this.props;
    const {isSimpleFilter} = this.state;
    const fieldSpec={
      doc: latest.layer.filter.doc + " Combine multiple filters together by using a compound filter."
    };
    const defaultFilter = ["all"];

    const isNestedCombiningFilter = isSimpleFilter && hasNestedCombiningFilter(this.combiningFilter());

    if (isNestedCombiningFilter) {
      return <div className="maputnik-filter-editor-unsupported">
        <p>
          Nested filters are not supported.
        </p>
        <Button
          onClick={this.makeExpression}
        >
          <svg style={{marginRight: "0.2em", width:"14px", height:"14px", verticalAlign: "middle"}} viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.42,5.29C11.32,5.19 10.35,6 10.25,7.11L10,10H12.82V12H9.82L9.38,17.07C9.18,19.27 7.24,20.9 5.04,20.7C3.79,20.59 2.66,19.9 2,18.83L3.5,17.33C3.83,18.38 4.96,18.97 6,18.63C6.78,18.39 7.33,17.7 7.4,16.89L7.82,12H4.82V10H8L8.27,6.93C8.46,4.73 10.39,3.1 12.6,3.28C13.86,3.39 15,4.09 15.66,5.17L14.16,6.67C13.91,5.9 13.23,5.36 12.42,5.29M22,13.65L20.59,12.24L17.76,15.07L14.93,12.24L13.5,13.65L16.35,16.5L13.5,19.31L14.93,20.72L17.76,17.89L20.59,20.72L22,19.31L19.17,16.5L22,13.65Z" />
          </svg>
          Upgrade to expression
        </Button>
      </div>
    }
    else if (isSimpleFilter) {
      const filter = this.combiningFilter();
      let combiningOp = filter[0];
      let filters = filter.slice(1)

      const actions = (
        <div>
          <Button
            onClick={this.makeExpression}
            className="maputnik-make-zoom-function"
          >
            <svg style={{width:"14px", height:"14px", verticalAlign: "middle"}} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.42,5.29C11.32,5.19 10.35,6 10.25,7.11L10,10H12.82V12H9.82L9.38,17.07C9.18,19.27 7.24,20.9 5.04,20.7C3.79,20.59 2.66,19.9 2,18.83L3.5,17.33C3.83,18.38 4.96,18.97 6,18.63C6.78,18.39 7.33,17.7 7.4,16.89L7.82,12H4.82V10H8L8.27,6.93C8.46,4.73 10.39,3.1 12.6,3.28C13.86,3.39 15,4.09 15.66,5.17L14.16,6.67C13.91,5.9 13.23,5.36 12.42,5.29M22,13.65L20.59,12.24L17.76,15.07L14.93,12.24L13.5,13.65L16.35,16.5L13.5,19.31L14.93,20.72L17.76,17.89L20.59,20.72L22,19.31L19.17,16.5L22,13.65Z" />
            </svg>
          </Button>
        </div>
      );

      const editorBlocks = filters.map((f, idx) => {
        const error = errors[`filter[${idx+1}]`];

        return (
          <>
            <FilterEditorBlock key={idx} onDelete={this.deleteFilterItem.bind(this, idx)}>
              <SingleFilterEditor
                properties={this.props.properties}
                filter={f}
                onChange={this.onFilterPartChanged.bind(this, idx + 1)}
              />
            </FilterEditorBlock>
            {error &&
              <div className="maputnik-inline-error">{error.message}</div>
            }
          </>
        );
      })


      return (
        <>
          <InputBlock
            key="top"
            fieldSpec={fieldSpec}
            label={"Compound filter"}
            action={actions}
          >
            <SelectInput
              value={combiningOp}
              onChange={this.onFilterPartChanged.bind(this, 0)}
              options={[["all", "every filter matches"], ["none", "no filter matches"], ["any", "any filter matches"]]}
            />
          </InputBlock>
          {editorBlocks}
          <div
            key="buttons"
            className="maputnik-filter-editor-add-wrapper"
          >
            <Button
              data-wd-key="layer-filter-button"
              className="maputnik-add-filter"
              onClick={this.addFilterItem}>
              Add filter
            </Button>
          </div>
          <div
            key="doc"
            className="maputnik-doc-inline"
            style={{display: this.state.showDoc ? '' : 'none'}}
          >
            <SpecDoc fieldSpec={fieldSpec} />
          </div>
        </>
      );
    }
    else {
      let {filter} = this.props;

      if (!filter) {
        filter = defaultFilter;
      }
      else if (isNestedCombiningFilter) {
        filter = migrateFilter(filter);
      }

      const errorMessage = Object.entries(errors)
        .filter(([k, v]) => k.match(/filter(\[\d+\])?/))
        .map(([k, v]) => {
          return v.message;
        })
        .join("\n")
      const error = errorMessage ? {message: errorMessage} : null;

      return (
        <ExpressionProperty
          onDelete={() => {
            this.setState({isSimpleFilter: true});
            this.props.onChange(defaultFilter);
          }}
          fieldName="filter-compound-filter"
          fieldSpec={fieldSpec}
          value={filter}
          error={error}
          onChange={this.props.onChange}
        />
      );
    }
  }
}
