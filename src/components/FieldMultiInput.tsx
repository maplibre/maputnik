import { InputMultiInput, type InputMultiInputProps } from "./InputMultiInput";
import { Fieldset } from "./Fieldset";


type FieldMultiInputProps = InputMultiInputProps & {
  label?: string
};


export const FieldMultiInput: React.FC<FieldMultiInputProps> = (props) => {
  return (
    <Fieldset label={props.label}>
      <InputMultiInput {...props} />
    </Fieldset>
  );
};

