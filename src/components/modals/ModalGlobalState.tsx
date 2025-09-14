import React from "react";
import { withTranslation, type WithTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";

import Modal from "./Modal";
import FieldString from "../FieldString";
import InputButton from "../InputButton";
import { PiListPlusBold } from "react-icons/pi";
import { type StyleSpecificationWithId } from "../../libs/definitions";
import { type SchemaSpecification } from "maplibre-gl";
import Doc from "../Doc";

type ModalGlobalStateInternalProps = {
  mapStyle: StyleSpecificationWithId;
  isOpen: boolean;
  onStyleChanged(style: StyleSpecificationWithId): void;
  onOpenToggle(): void
} & WithTranslation;

type GlobalStateVariable = {
  key: string;
  value: any;
};

const ModalGlobalStateInternal: React.FC<ModalGlobalStateInternalProps> = (props) => {
  const getGlobalStateVariables = (): GlobalStateVariable[] => {
    const style = props.mapStyle;
    const globalState = style.state || {};

    return Object.entries(globalState).map(([key, value]) => ({
      key,
      value: value.default
    }));
  };

  const setGlobalStateVariables = (variables: GlobalStateVariable[]) => {
    const style = { ...props.mapStyle };

    // Create the globalState object from the variables array
    const globalState: Record<string, SchemaSpecification> = {};
    for (const variable of variables) {
      if (variable.key.trim() !== "") {
        globalState[variable.key] = {
          default: variable.value
        };
      }
    }

    style.state = Object.keys(globalState).length > 0 ? globalState : undefined;

    props.onStyleChanged(style);
  };

  const onAddVariable = () => {
    const variables = getGlobalStateVariables();
    let index = 1;
    while (variables.find(v => v.key === `key${index}`)) {
      index++;
    }
    variables.push({ key: `key${index}`, value: `value` });
    setGlobalStateVariables(variables);
  };

  const onRemoveVariable = (index: number) => {
    const variables = getGlobalStateVariables();
    variables.splice(index, 1);
    setGlobalStateVariables(variables);
  };

  const onChangeVariableKey = (index: number, newKey: string) => {
    const variables = getGlobalStateVariables();
    variables[index].key = newKey || "";
    setGlobalStateVariables(variables);
  };

  const onChangeVariableValue = (index: number, newValue: string) => {
    const variables = getGlobalStateVariables();

    variables[index].value = newValue || "";
    setGlobalStateVariables(variables);
  };

  const variables = getGlobalStateVariables();

  const variableFields = variables.map((variable, index) => (
    <tr key={index}>
      <td>
        <FieldString
          label={props.t("Key")}
          value={variable.key}
          onChange={(value) => onChangeVariableKey(index, value || "")}
          data-wd-key={"global-state-variable-key:" + index}
        />
      </td>
      <td>
        <FieldString
          label={props.t("Value")}
          value={variable.value}
          onChange={(value) => onChangeVariableValue(index, value || "")}
          data-wd-key={"global-state-variable-value:" + index}
        />
      </td>
      <td style={{ verticalAlign: "middle"}}>
        <InputButton
          onClick={() => onRemoveVariable(index)}
          title={props.t("Remove variable")}
          data-wd-key="global-state-remove-variable"
        >
          <MdDelete />
        </InputButton>
      </td>
    </tr>
  ));

  return (
    <Modal
      data-wd-key="modal:global-state"
      isOpen={props.isOpen}
      onOpenToggle={props.onOpenToggle}
      title={props.t("Global State Variables")}
    >

      {variables.length === 0 &&
            <div>
              <p>{props.t("No global state variables defined. Add variables to create reusable values in your style.")}</p>
              <div key="doc" className="maputnik-doc-inline">
                <Doc fieldSpec={latest.$root.state} />
              </div>
            </div>
      }
      {variables.length > 0 &&
      <table>
        <thead>
        </thead>
        <tbody>
          {variableFields}
        </tbody>
      </table>
      }
      <div>
        <InputButton
          onClick={onAddVariable}
          data-wd-key="global-state-add-variable"
        >
          <PiListPlusBold />
          {props.t("Add Variable")}
        </InputButton>
      </div>
    </Modal>
  );
};

const ModalGlobalState = withTranslation()(ModalGlobalStateInternal);
export default ModalGlobalState;
