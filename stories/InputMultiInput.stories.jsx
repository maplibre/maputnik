import React from 'react';
import {useActionState} from './helper';
import InputMultiInput from '../src/components/InputMultiInput';
import {InputContainer} from './ui';

export default {
  title: 'InputMultiInput',
  component: InputMultiInput,
};


export const Basic = () => {
  const options = [["FOO", "foo"], ["BAR", "bar"], ["BAZ", "baz"]];
  const [value, setValue] = useActionState("onChange", "FOO");

  return (
    <InputContainer>
      <InputMultiInput
        options={options}
        value={value}
        onChange={setValue}
      />
    </InputContainer>
  );
};


