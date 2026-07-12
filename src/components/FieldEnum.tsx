import { InputEnum, type InputEnumProps } from "./InputEnum";
import { Fieldset } from "./Fieldset";


type FieldEnumProps = InputEnumProps & {
  label?: string;
  fieldSpec?: {
    doc: string
  }
};


export const FieldEnum: React.FC<FieldEnumProps> = (props) => {
  return (
    <Fieldset label={props.label} fieldSpec={props.fieldSpec}>
      <InputEnum {...props} />
    </Fieldset>
  );
};
