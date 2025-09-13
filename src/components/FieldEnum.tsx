import Fieldset from "./Fieldset";
import InputEnum, { type InputEnumProps } from "./InputEnum";

type FieldEnumProps = InputEnumProps & {
  label?: string;
  fieldSpec?: {
    doc: string;
  };
};

const FieldEnum: React.FC<FieldEnumProps> = (props) => {
  return (
    <Fieldset label={props.label} fieldSpec={props.fieldSpec}>
      <InputEnum {...props} />
    </Fieldset>
  );
};

export default FieldEnum;
