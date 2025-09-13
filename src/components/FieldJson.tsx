import InputJson, {type InputJsonProps} from "./InputJson";


type FieldJsonProps = InputJsonProps & {};


const FieldJson: React.FC<FieldJsonProps> = (props) => {
  return <InputJson {...props} />;
};

export default FieldJson;
