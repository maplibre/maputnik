import Fieldset from "./Fieldset";
import InputArray, { type InputArrayProps } from "./InputArray";

type FieldArrayProps = InputArrayProps & {
  name?: string;
  fieldSpec?: {
    doc: string;
  };
};

const FieldArray: React.FC<FieldArrayProps> = (props) => {
  return (
    <Fieldset label={props.label} fieldSpec={props.fieldSpec}>
      <InputArray {...props} />
    </Fieldset>
  );
};

export default FieldArray;
