import { Block } from "./Block";
import { InputAutocomplete, type InputAutocompleteProps } from "./InputAutocomplete";


type FieldAutocompleteProps = InputAutocompleteProps & {
  label?: string;
};


export const FieldAutocomplete: React.FC<FieldAutocompleteProps> = (props) => {
  return (
    <Block label={props.label}>
      <InputAutocomplete {...props} />
    </Block>
  );
};
