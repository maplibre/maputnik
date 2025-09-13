import Block from "./Block";
import InputString, {InputStringProps} from "./InputString";

type FieldStringProps = InputStringProps & {
  name?: string
  label?: string
  fieldSpec?: {
    doc: string
  }
};

const FieldString: React.FC<FieldStringProps> = (props) => {
  return (
    <Block label={props.label} fieldSpec={props.fieldSpec}>
      <InputString {...props} />
    </Block>
  );
};

export default FieldString;
