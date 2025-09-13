import Block from "./Block";
import InputSelect, {InputSelectProps} from "./InputSelect";


type FieldSelectProps = InputSelectProps & {
  label?: string
  fieldSpec?: {
    doc: string
  }
};


const FieldSelect: React.FC<FieldSelectProps> = (props) => {
  return (
    <Block label={props.label} fieldSpec={props.fieldSpec}>
      <InputSelect {...props} />
    </Block>
  );
};

export default FieldSelect;
