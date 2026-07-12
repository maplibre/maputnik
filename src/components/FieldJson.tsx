import { InputJson, type InputJsonProps } from "./InputJson";


type FieldJsonProps = InputJsonProps & {};


export const FieldJson: React.FC<FieldJsonProps> = (props) => {
  return <InputJson {...props} />;
};
