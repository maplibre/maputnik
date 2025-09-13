import Block from "./Block";
import InputSpec, { FieldSpecType, InputSpecProps } from "./InputSpec";
import Fieldset from "./Fieldset";

function getElementFromType(fieldSpec: { type?: FieldSpecType, values?: unknown[] }): typeof Fieldset | typeof Block {
  switch(fieldSpec.type) {
    case "color":
      return Block;
    case "enum":
      return (Object.keys(fieldSpec.values!).length <= 3 ? Fieldset : Block);
    case "boolean":
      return Block;
    case "array":
      return Fieldset;
    case "resolvedImage":
      return Block;
    case "number":
      return Block;
    case "string":
      return Block;
    case "formatted":
      return Block;
    case "padding":
      return Block;
    case "numberArray":
      return Fieldset;
    case "colorArray":
      return Fieldset;
    case "variableAnchorOffsetCollection":
      return Fieldset;
    default:
      console.warn("No such type for: " + fieldSpec.type);
      return Block;
  }
}

export type FieldSpecProps = InputSpecProps & {
  name?: string
};

const FieldSpec: React.FC<FieldSpecProps> = (props) => {
  const TypeBlock = getElementFromType(props.fieldSpec!);

  return (
    <TypeBlock label={props.label} action={props.action} fieldSpec={props.fieldSpec}>
      <InputSpec {...props} />
    </TypeBlock>
  );
};

export default FieldSpec;
