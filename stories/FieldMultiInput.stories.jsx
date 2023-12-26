import React from 'react';
import {useActionState} from './helper';
import FieldMultiInput from '../src/components/FieldMultiInput';
import {Wrapper} from './ui';

export default {
  title: 'FieldMultiInput',
  component: FieldMultiInput,
};


export const Basic = () => {
  const options = [["FOO", "foo"], ["BAR", "bar"], ["BAZ", "baz"]];
  const [value, setValue] = useActionState("onChange", "FOO");

  return (
    <Wrapper>
      <FieldMultiInput
        label="Foobar"
        options={options}
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

