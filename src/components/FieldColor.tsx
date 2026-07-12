import { Block } from "./Block";
import { InputColor, type InputColorProps } from "./InputColor";


type FieldColorProps = InputColorProps & {
  label?: string
  fieldSpec?: {
    doc: string
  }
};


export const FieldColor: React.FC<FieldColorProps> = (props) => {
  return (
    <Block label={props.label} fieldSpec={props.fieldSpec}>
      <InputColor {...props} />
    </Block>
  );
};
