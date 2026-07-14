import { InputDynamicArray, type InputDynamicArrayProps } from "./InputDynamicArray";
import { Fieldset } from "./Fieldset";

type FieldDynamicArrayProps = InputDynamicArrayProps & {
  name?: string;
  fieldSpec?: {
    value?: string;
  }
};

export const FieldDynamicArray: React.FC<FieldDynamicArrayProps> = (props) => {
  return (
    <Fieldset label={props.label}>
      <InputDynamicArray {...props} />
    </Fieldset>
  );
};
