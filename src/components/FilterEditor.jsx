import React from 'react'
import PropTypes from 'prop-types'
import { combiningFilterOps } from '../libs/filterops.js'
import {mdiTableRowPlusAfter} from '@mdi/js';
import {isEqual} from 'lodash';

import {latest, validate, migrate, convertFilter} from '@mapbox/mapbox-gl-style-spec'
import InputSelect from './InputSelect'
import Block from './Block'
import SingleFilterEditor from './SingleFilterEditor'
import FilterEditorBlock from './FilterEditorBlock'
import InputButton from './InputButton'
import Doc from './Doc'
import ExpressionProperty from './_ExpressionProperty';
import {mdiFunctionVariant} from '@mdi/js';


function combiningFilter (props) {
  let filter = props.filter || ['all'];

  if (!Array.isArray(filter)) {
    return filter;
  }

  let combiningOp = filter[0];
  let filters = filter.slice(1);

  if(combiningFilterOps.indexOf(combiningOp) < 0) {
    combiningOp = 'all';
    filters = [filter.slice(0)];
  }

  return [combiningOp, ...filters];
}

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

const FILTER_OPS = [
  "all",
  "any",
  "none"
];

// If we convert a filter that is an expression to an expression it'll remain the same in value
function checkIfSimpleFilter (filter) {
  if (filter.length === 1 && FILTER_OPS.includes(filter[0])) {
    return true;
  }
  const expression = convertFilter(filter);
  return !isEqual(expression, filter);
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

export default class FilterEditor extends React.Component {
  static propTypes = {
    /** Properties of the vector layer and the available fields */
    properties: PropTypes.object,
    filter: PropTypes.array,
    errors: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    filter: ["all"],
  }

  constructor (props) {
    super();
    this.state = {
      showDoc: false,
      displaySimpleFilter: checkIfSimpleFilter(combiningFilter(props)),
    };
  }

  // Convert filter to combining filter
  onFilterPartChanged(filterIdx, newPart) {
    const newFilter = combiningFilter(this.props).slice(0)
    newFilter[filterIdx] = newPart
    this.props.onChange(newFilter)
  }

  deleteFilterItem(filterIdx) {
    const newFilter = combiningFilter(this.props).slice(0)
    newFilter.splice(filterIdx + 1, 1)
    this.props.onChange(newFilter)
  }

  addFilterItem = () => {
    const newFilterItem = combiningFilter(this.props).slice(0)
    newFilterItem.push(['==', 'name', ''])
    this.props.onChange(newFilterItem)
  }

  onToggleDoc = (val) => {
    this.setState({
      showDoc: val
    });
  }

  makeFilter = () => {
    this.setState({
      displaySimpleFilter: true,
    })
  }

  makeExpression = () => {
    let filter = combiningFilter(this.props);
    this.props.onChange(migrateFilter(filter));
    this.setState({
      displaySimpleFilter: false,
    })
  }

  static getDerivedStateFromProps (props, currentState) {
    const {filter} = props;
    const displaySimpleFilter = checkIfSimpleFilter(combiningFilter(props));

    // Upgrade but never downgrade
    if (!displaySimpleFilter && currentState.displaySimpleFilter === true) {
      return {
        displaySimpleFilter: false,
        valueIsSimpleFilter: false,
      };
    }
    else if (displaySimpleFilter && currentState.displaySimpleFilter === false) {
      return {
        valueIsSimpleFilter: true,
      }
    }
    else {
      return {
        valueIsSimpleFilter: false,
      };
    }
  }

  render() {
    const {errors} = this.props;
    const {displaySimpleFilter} = this.state;
    const fieldSpec={
      doc: latest.layer.filter.doc + " Combine multiple filters together by using a compound filter."
    };
    const defaultFilter = ["all"];

    const isNestedCombiningFilter = displaySimpleFilter && hasNestedCombiningFilter(combiningFilter(this.props));

    if (isNestedCombiningFilter) {
      return <div className="maputnik-filter-editor-unsupported">
        <p>
          Nested filters are not supported.
        </p>
        <InputButton
          onClick={this.makeExpression}
          title="Convert to expression"
        >
          <svg style={{marginRight: "0.2em", width:"14px", height:"14px", verticalAlign: "middle"}} viewBox="0 0 24 24">
            <path fill="currentColor" d={mdiFunctionVariant} />
          </svg>
          Upgrade to expression
        </InputButton>
      </div>
    }
    else if (displaySimpleFilter) {
      const filter = combiningFilter(this.props);
      let combiningOp = filter[0];
      let filters = filter.slice(1)

      const actions = (
        <div>
          <InputButton
            onClick={this.makeExpression}
            title="Convert to expression"
            className="maputnik-make-zoom-function"
          >
            <svg style={{width:"14px", height:"14px", verticalAlign: "middle"}} viewBox="0 0 24 24">
              <path fill="currentColor" d={mdiFunctionVariant} />
            </svg>
          </InputButton>
        </div>
      );

      const editorBlocks = filters.map((f, idx) => {
        const error = errors[`filter[${idx+1}]`];

        return (
          <div key={`block-${idx}`}>
            <FilterEditorBlock key={idx} onDelete={this.deleteFilterItem.bind(this, idx)}>
              <SingleFilterEditor
                properties={this.props.properties}
                filter={f}
                onChange={this.onFilterPartChanged.bind(this, idx + 1)}
              />
            </FilterEditorBlock>
            {error &&
              <div key="error" className="maputnik-inline-error">{error.message}</div>
            }
          </div>
        );
      })


      return (
        <>
          <Block
            key="top"
            fieldSpec={fieldSpec}
            label={"Filter"}
            action={actions}
          >
            <InputSelect
              value={combiningOp}
              onChange={this.onFilterPartChanged.bind(this, 0)}
              options={[["all", "every filter matches"], ["none", "no filter matches"], ["any", "any filter matches"]]}
            />
          </Block>
          {editorBlocks}
          <div
            key="buttons"
            className="maputnik-filter-editor-add-wrapper"
          >
            <InputButton
              data-wd-key="layer-filter-button"
              className="maputnik-add-filter"
              onClick={this.addFilterItem}
            >
              <svg style={{width:"14px", height:"14px", verticalAlign: "text-bottom"}} viewBox="0 0 24 24">
                <path fill="currentColor" d={mdiTableRowPlusAfter} />
              </svg> Add filter
            </InputButton>
          </div>
          <div
            key="doc"
            className="maputnik-doc-inline"
            style={{display: this.state.showDoc ? '' : 'none'}}
          >
            <Doc fieldSpec={fieldSpec} />
          </div>
        </>
      );
    }
    else {
      let {filter} = this.props;

      return (
        <>
          <ExpressionProperty
            onDelete={() => {
              this.setState({displaySimpleFilter: true});
              this.props.onChange(defaultFilter);
            }}
            fieldName="filter"
            fieldSpec={fieldSpec}
            value={filter}
            errors={errors}
            onChange={this.props.onChange}
          />
          {this.state.valueIsSimpleFilter &&
            <div className="maputnik-expr-infobox">
              You&apos;ve entered a old style filter,{' '}
              <button
                onClick={this.makeFilter}
                className="maputnik-expr-infobox__button"
              >
                switch to filter editor
              </button>
            </div>
          }
        </>
      );
    }
  }
}
