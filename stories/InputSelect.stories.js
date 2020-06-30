import React from 'react';
import {useActionState} from './helper';
import InputSelect from '../src/components/InputSelect';
import {InputContainer} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'InputSelect',
  component: InputSelect,
  decorators: [withA11y],
};


export const Basic = () => {
  const options = [["FOO", "Foo"], ["BAR", "Bar"], ["BAZ", "Baz"]];
  const [value, setValue] = useActionState("onChange", "FOO");

  return (
    <InputContainer>
      <InputSelect
        options={options}
        value={value}
        onChange={setValue}
      />
    </InputContainer>
  );
};



