import React from 'react';
import {useActionState} from './helper';
import FieldMultiInput from '../src/components/FieldMultiInput';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldMultiInput',
  component: FieldMultiInput,
  decorators: [withA11y],
};


export const Basic = () => {
  const options = [["FOO", "foo"], ["BAR", "bar"], ["BAZ", "baz"]];
  const [value, setValue] = useActionState("onChange", "FOO");

  return (
    <Wrapper>
      <FieldMultiInput
        options={options}
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

