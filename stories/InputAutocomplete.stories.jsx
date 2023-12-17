import React from 'react';
import {useActionState} from './helper';
import InputAutocomplete from '../src/components/InputAutocomplete';
import {InputContainer} from './ui';

export default {
  title: 'InputAutocomplete',
  component: InputAutocomplete,
};


export const Basic = () => {
  const options = [["FOO", "foo"], ["BAR", "bar"], ["BAZ", "baz"]];
  const [value, setValue] = useActionState("onChange", "bar");

  return (
    <InputContainer>
      <InputAutocomplete
        label="Foobar"
        options={options}
        value={value}
        onChange={setValue}
      />
    </InputContainer>
  );
};

