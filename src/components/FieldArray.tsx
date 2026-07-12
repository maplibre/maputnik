import { InputArray, type InputArrayProps } from "./InputArray";
import { Fieldset } from "./Fieldset";

type FieldArrayProps = InputArrayProps & {
  name?: string
  fieldSpec?: {
    doc: string
  }
};

export const FieldArray: React.FC<FieldArrayProps> = (props) => {
  return (
    <Fieldset label={props.label} fieldSpec={props.fieldSpec}>
      <InputArray {...props} />
    </Fieldset>
  );
};
