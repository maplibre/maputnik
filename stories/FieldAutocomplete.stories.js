import React from 'react';
import {useActionState} from './helper';
import FieldAutocomplete from '../src/components/FieldAutocomplete';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldAutocomplete',
  component: FieldAutocomplete,
  decorators: [withA11y],
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

