import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import Block from "./Block";
import InputString from "./InputString";

type FieldIdProps = {
  value: string;
  wdKey: string;
  onChange(value: string | undefined): unknown;
  error?: { message: string };
};

const FieldId: React.FC<FieldIdProps> = (props) => {
  return (
    <Block
      label="ID"
      fieldSpec={latest.layer.id}
      data-wd-key={props.wdKey}
      error={props.error}
    >
      <InputString
        value={props.value}
        onInput={props.onChange}
        data-wd-key={props.wdKey + ".input"}
      />
    </Block>
  );
};

export default FieldId;
