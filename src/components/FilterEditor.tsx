import {
  convertFilter,
  latest,
  migrate,
} from "@maplibre/maplibre-gl-style-spec";
import { isEqual } from "lodash";
import type {
  ExpressionSpecification,
  LegacyFilterSpecification,
} from "maplibre-gl";
import React from "react";
import { type WithTranslation, withTranslation } from "react-i18next";
import { PiListPlusBold } from "react-icons/pi";
import { TbMathFunction } from "react-icons/tb";
import type { StyleSpecificationWithId } from "../libs/definitions";
import { combiningFilterOps } from "../libs/filterops";
import ExpressionProperty from "./_ExpressionProperty";
import Block from "./Block";
import Doc from "./Doc";
import FilterEditorBlock from "./FilterEditorBlock";
import InputButton from "./InputButton";
import InputSelect from "./InputSelect";
import SingleFilterEditor from "./SingleFilterEditor";

function combiningFilter(
  props: FilterEditorInternalProps,
): LegacyFilterSpecification | ExpressionSpecification {
  const filter = props.filter || ["all"];

  if (!Array.isArray(filter)) {
    return filter;
  }

  let combiningOp = filter[0];
  let filters = filter.slice(1);

  if (combiningFilterOps.indexOf(combiningOp) < 0) {
    combiningOp = "all";
    filters = [filter.slice(0)];
  }

  return [combiningOp, ...filters] as
    | LegacyFilterSpecification
    | ExpressionSpecification;
}

function migrateFilter(
  filter: LegacyFilterSpecification | ExpressionSpecification,
) {
  // This "any" can be removed in latest version of maplibre where maplibre re-exported types from style-spec
  return (migrate(createStyleFromFilter(filter) as any).layers[0] as any)
    .filter;
}

function createStyleFromFilter(
  filter: LegacyFilterSpecification | ExpressionSpecification,
): StyleSpecificationWithId {
  return {
    id: "tmp",
    version: 8,
    name: "Empty Style",
    metadata: { "maputnik:renderer": "mlgljs" },
    sources: {
      tmp: {
        type: "geojson",
        data: "",
      },
    },
    sprite: "",
    glyphs:
      "https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf",
    layers: [
      {
        id: "tmp",
        type: "fill",
        source: "tmp",
        filter: filter,
      },
    ],
  };
}

const FILTER_OPS = ["all", "any", "none"];

// If we convert a filter that is an expression to an expression it'll remain the same in value
function checkIfSimpleFilter(
  filter: LegacyFilterSpecification | ExpressionSpecification,
) {
  if (filter.length === 1 && FILTER_OPS.includes(filter[0])) {
    return true;
  }
  const expression = convertFilter(filter);
  return !isEqual(expression, filter);
}

function hasCombiningFilter(
  filter: LegacyFilterSpecification | ExpressionSpecification,
) {
  return combiningFilterOps.indexOf(filter[0]) >= 0;
}

function hasNestedCombiningFilter(
  filter: LegacyFilterSpecification | ExpressionSpecification,
) {
  if (hasCombiningFilter(filter)) {
    return (
      filter
        .slice(1)
        .map((f) => hasCombiningFilter(f as any))
        .filter((f) => f === true).length > 0
    );
  }
  return false;
}

type FilterEditorInternalProps = {
  /** Properties of the vector layer and the available fields */
  properties?: { [key: string]: any };
  filter?: any[];
  errors?: { [key: string]: any };
  onChange(value: LegacyFilterSpecification | ExpressionSpecification): unknown;
} & WithTranslation;

type FilterEditorState = {
  showDoc: boolean;
  displaySimpleFilter: boolean;
  valueIsSimpleFilter?: boolean;
};

class FilterEditorInternal extends React.Component<
  FilterEditorInternalProps,
  FilterEditorState
> {
  static defaultProps = {
    filter: ["all"],
  };

  constructor(props: FilterEditorInternalProps) {
    super(props);
    this.state = {
      showDoc: false,
      displaySimpleFilter: checkIfSimpleFilter(combiningFilter(props)),
    };
  }

  // Convert filter to combining filter
  onFilterPartChanged(filterIdx: number, newPart: any[]) {
    const newFilter = combiningFilter(this.props).slice(0) as
      | LegacyFilterSpecification
      | ExpressionSpecification;
    newFilter[filterIdx] = newPart;
    this.props.onChange(newFilter);
  }

  deleteFilterItem(filterIdx: number) {
    const newFilter = combiningFilter(this.props).slice(0) as
      | LegacyFilterSpecification
      | ExpressionSpecification;
    newFilter.splice(filterIdx + 1, 1);
    this.props.onChange(newFilter);
  }

  addFilterItem = () => {
    const newFilterItem = combiningFilter(this.props).slice(0) as
      | LegacyFilterSpecification
      | ExpressionSpecification;
    (newFilterItem as any[]).push(["==", "name", ""]);
    this.props.onChange(newFilterItem);
  };

  onToggleDoc = (val: boolean) => {
    this.setState({
      showDoc: val,
    });
  };

  makeFilter = () => {
    this.setState({
      displaySimpleFilter: true,
    });
  };

  makeExpression = () => {
    const filter = combiningFilter(this.props);
    this.props.onChange(migrateFilter(filter));
    this.setState({
      displaySimpleFilter: false,
    });
  };

  static getDerivedStateFromProps(
    props: Readonly<FilterEditorInternalProps>,
    state: FilterEditorState,
  ) {
    const displaySimpleFilter = checkIfSimpleFilter(combiningFilter(props));

    // Upgrade but never downgrade
    if (!displaySimpleFilter && state.displaySimpleFilter === true) {
      return {
        displaySimpleFilter: false,
        valueIsSimpleFilter: false,
      };
    } else if (displaySimpleFilter && state.displaySimpleFilter === false) {
      return {
        valueIsSimpleFilter: true,
      };
    } else {
      return {
        valueIsSimpleFilter: false,
      };
    }
  }

  render() {
    const { errors, t } = this.props;
    const { displaySimpleFilter } = this.state;
    const fieldSpec = {
      doc:
        latest.layer.filter.doc +
        " Combine multiple filters together by using a compound filter.",
    };
    const defaultFilter = ["all"] as
      | LegacyFilterSpecification
      | ExpressionSpecification;

    const isNestedCombiningFilter =
      displaySimpleFilter &&
      hasNestedCombiningFilter(combiningFilter(this.props));

    if (isNestedCombiningFilter) {
      return (
        <div className="maputnik-filter-editor-unsupported">
          <p>{t("Nested filters are not supported.")}</p>
          <InputButton
            onClick={this.makeExpression}
            title={t("Convert to expression")}
          >
            <TbMathFunction />
            {t("Upgrade to expression")}
          </InputButton>
        </div>
      );
    } else if (displaySimpleFilter) {
      const filter = combiningFilter(this.props);
      const combiningOp = filter[0];
      const filters = filter.slice(1) as (
        | LegacyFilterSpecification
        | ExpressionSpecification
      )[];

      const actions = (
        <div>
          <InputButton
            onClick={this.makeExpression}
            title={t("Convert to expression")}
            className="maputnik-make-zoom-function"
          >
            <TbMathFunction />
          </InputButton>
        </div>
      );

      const editorBlocks = filters.map((f, idx) => {
        const error = errors?.[`filter[${idx + 1}]`];

        const keyStr = (() => {
          try {
            return JSON.stringify(f);
          } catch {
            return String(idx);
          }
        })();

        return (
          <div key={`block-${keyStr}`}>
            <FilterEditorBlock
              key={keyStr}
              onDelete={this.deleteFilterItem.bind(this, idx)}
            >
              <SingleFilterEditor
                properties={this.props.properties}
                filter={f}
                onChange={this.onFilterPartChanged.bind(this, idx + 1)}
              />
            </FilterEditorBlock>
            {error && (
              <div key="error" className="maputnik-inline-error">
                {error.message}
              </div>
            )}
          </div>
        );
      });

      return (
        <>
          <Block
            key="top"
            fieldSpec={fieldSpec}
            label={t("Filter")}
            action={actions}
          >
            <InputSelect
              value={combiningOp}
              onChange={(v: [string, any]) => this.onFilterPartChanged(0, v)}
              options={[
                ["all", t("every filter matches")],
                ["none", t("no filter matches")],
                ["any", t("any filter matches")],
              ]}
            />
          </Block>
          {editorBlocks}
          <div key="buttons" className="maputnik-filter-editor-add-wrapper">
            <InputButton
              data-wd-key="layer-filter-button"
              className="maputnik-add-filter"
              onClick={this.addFilterItem}
            >
              <PiListPlusBold style={{ verticalAlign: "text-bottom" }} />
              {t("Add filter")}
            </InputButton>
          </div>
          <div
            key="doc"
            className="maputnik-doc-inline"
            style={{ display: this.state.showDoc ? "" : "none" }}
          >
            <Doc fieldSpec={fieldSpec} />
          </div>
        </>
      );
    } else {
      const { filter } = this.props;

      return (
        <>
          <ExpressionProperty
            onDelete={() => {
              this.setState({ displaySimpleFilter: true });
              this.props.onChange(defaultFilter);
            }}
            fieldName="filter"
            fieldSpec={fieldSpec}
            value={filter}
            errors={errors}
            onChange={this.props.onChange}
          />
          {this.state.valueIsSimpleFilter && (
            <div className="maputnik-expr-infobox">
              {t("You've entered an old style filter.")}{" "}
              <button
                type="button"
                onClick={this.makeFilter}
                className="maputnik-expr-infobox__button"
              >
                {t("Switch to filter editor.")}
              </button>
            </div>
          )}
        </>
      );
    }
  }
}

const FilterEditor = withTranslation()(FilterEditorInternal);
export default FilterEditor;
