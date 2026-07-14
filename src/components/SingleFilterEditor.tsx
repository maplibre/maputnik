import React from "react";

import {otherFilterOps} from "../libs/filterops";
import { InputString } from "./InputString";
import { InputAutocomplete } from "./InputAutocomplete";
import { InputSelect } from "./InputSelect";

function tryParseInt(v: string | number) {
  if (v === "") return v;
  if (isNaN(v as number)) return v;
  return parseFloat(v as string);
}

function tryParseBool(v: string | boolean) {
  const isString = (typeof(v) === "string");
  if(!isString) {
    return v;
  }

  if(v.match(/^\s*true\s*$/)) {
    return true;
  }
  else if(v.match(/^\s*false\s*$/)) {
    return false;
  }
  else {
    return v;
  }
}

function parseFilter(v: string | boolean | number) {
  v = tryParseInt(v as any);
  v = tryParseBool(v as any);
  return v;
}

type SingleFilterEditorProps = {
  filter: any[]
  onChange(filter: any[]): unknown
  properties?: {[key: string]: string}
};

export const SingleFilterEditor: React.FC<SingleFilterEditorProps> = ({
  properties = {},
  ...props
}) => {
  function onFilterPartChanged(filterOp: string, propertyName: string, filterArgs: string[]) {
    let newFilter = [filterOp, propertyName, ...filterArgs.map(parseFilter)];
    if(filterOp === "has" || filterOp === "!has") {
      newFilter = [filterOp, propertyName];
    } else if(filterArgs.length === 0) {
      newFilter = [filterOp, propertyName, ""];
    }
    props.onChange(newFilter);
  }

  const f = props.filter;
  const filterOp = f[0];
  const propertyName = f[1];
  const filterArgs = f.slice(2);

  return <div className="maputnik-filter-editor-single">
    <div className="maputnik-filter-editor-property">
      <InputAutocomplete
        aria-label="key"
        value={propertyName}
        options={Object.keys(properties).map(propName => [propName, propName])}
        onChange={(newPropertyName: string) => onFilterPartChanged(filterOp, newPropertyName, filterArgs)}
      />
    </div>
    <div className="maputnik-filter-editor-operator">
      <InputSelect
        aria-label="function"
        value={filterOp}
        onChange={(newFilterOp: string) => onFilterPartChanged(newFilterOp, propertyName, filterArgs)}
        options={otherFilterOps}
      />
    </div>
    {filterArgs.length > 0 &&
    <div className="maputnik-filter-editor-args">
      <InputString
        aria-label="value"
        value={filterArgs.join(",")}
        onChange={(v: string) => onFilterPartChanged(filterOp, propertyName, v.split(","))}
      />
    </div>
    }
  </div>;
};
