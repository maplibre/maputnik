import Block from "./Block";
import InputNumber, { type InputNumberProps } from "./InputNumber";

type FieldNumberProps = InputNumberProps & {
  label?: string;
  fieldSpec?: {
    doc: string;
  };
};

const FieldNumber: React.FC<FieldNumberProps> = (props) => {
  return (
    <Block label={props.label} fieldSpec={props.fieldSpec}>
      <InputNumber {...props} />
    </Block>
  );
};

export default FieldNumber;
