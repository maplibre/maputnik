import InputDynamicArray, {InputDynamicArrayProps} from './InputDynamicArray'
import Fieldset from './Fieldset'

type FieldDynamicArrayProps = InputDynamicArrayProps & {
  name?: string
};

const FieldDynamicArray: React.FC<FieldDynamicArrayProps> = (props) => {
  return (
    <Fieldset label={props.label}>
      <InputDynamicArray {...props} />
    </Fieldset>
  );
};

export default FieldDynamicArray;
