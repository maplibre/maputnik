import Block from './Block'
import InputCheckbox, {InputCheckboxProps} from './InputCheckbox'


type FieldCheckboxProps = InputCheckboxProps & {
  label?: string;
};


const FieldCheckbox: React.FC<FieldCheckboxProps> = (props) => {
  return (
    <Block label={props.label}>
      <InputCheckbox {...props} />
    </Block>
  );
};

export default FieldCheckbox;
