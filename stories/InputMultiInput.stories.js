import React from 'react';
import {useActionState} from './helper';
import InputMultiInput from '../src/components/InputMultiInput';
import {InputContainer} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'InputMultiInput',
  component: InputMultiInput,
  decorators: [withA11y],
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


