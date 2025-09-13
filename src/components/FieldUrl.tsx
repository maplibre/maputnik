import InputUrl, {FieldUrlProps as InputUrlProps} from "./InputUrl";
import Block from "./Block";


type FieldUrlProps = InputUrlProps & {
  label: string;
  fieldSpec?: {
    doc: string
  }
};


const FieldUrl: React.FC<FieldUrlProps> = (props) => {
  return (
    <Block label={props.label} fieldSpec={props.fieldSpec}>
      <InputUrl {...props} />
    </Block>
  );
};

export default FieldUrl;
