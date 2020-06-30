import React from 'react';
import {useActionState} from './helper';
import InputAutocomplete from '../src/components/InputAutocomplete';
import {InputContainer} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'InputAutocomplete',
  component: InputAutocomplete,
  decorators: [withA11y],
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

