import React from 'react';
import {useActionState} from './helper';
import FieldSelect from '../src/components/FieldSelect';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldSelect',
  component: FieldSelect,
  decorators: [withA11y],
};


export const Basic = () => {
  const options = [["FOO", "Foo"], ["BAR", "Bar"], ["BAZ", "Baz"]];
  const [value, setValue] = useActionState("onChange", "FOO");

  return (
    <Wrapper>
      <FieldSelect
        options={options}
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};


