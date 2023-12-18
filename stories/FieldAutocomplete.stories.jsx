import React from 'react';
import {useActionState} from './helper';
import FieldAutocomplete from '../src/components/FieldAutocomplete';
import {Wrapper} from './ui';

export default {
  title: 'FieldAutocomplete',
  component: FieldAutocomplete,
};


export const Basic = () => {
  const options = [["FOO", "foo"], ["BAR", "bar"], ["BAZ", "baz"]];
  const [value, setValue] = useActionState("onChange", "bar");

  return (
    <Wrapper>
      <FieldAutocomplete
        label="Foobar"
        options={options}
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

