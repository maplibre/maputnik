import Block from "./Block";
import InputColor, {InputColorProps} from "./InputColor";


type FieldColorProps = InputColorProps & {
  label?: string
  fieldSpec?: {
    doc: string
  }
};


const FieldColor: React.FC<FieldColorProps> = (props) => {
  return (
    <Block label={props.label} fieldSpec={props.fieldSpec}>
      <InputColor {...props} />
    </Block>
  );
};

export default FieldColor;
