import { Block } from "./Block";
import { InputSelect, type InputSelectProps } from "./InputSelect";


type FieldSelectProps = InputSelectProps & {
  label?: string
  fieldSpec?: {
    doc: string
  }
};


export const FieldSelect: React.FC<FieldSelectProps> = (props) => {
  return (
    <Block label={props.label} fieldSpec={props.fieldSpec}>
      <InputSelect {...props} />
    </Block>
  );
};

