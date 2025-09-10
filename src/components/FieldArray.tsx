import InputArray, { InputArrayProps } from './InputArray'
import Fieldset from './Fieldset'

type FieldArrayProps = InputArrayProps & {
  name?: string
  fieldSpec?: {
    doc: string
  }
};

const FieldArray: React.FC<FieldArrayProps> = (props) => {
  return (
    <Fieldset label={props.label} fieldSpec={props.fieldSpec}>
      <InputArray {...props} />
    </Fieldset>
  );
};

export default FieldArray;
