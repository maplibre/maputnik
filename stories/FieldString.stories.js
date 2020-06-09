import React from 'react';
import {useActionState} from './helper';
import FieldString from '../src/components/FieldString';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldString',
  component: FieldString,
  decorators: [withA11y],
};


export const Basic = () => {
  const [value, setValue] = useActionState("onChange", "Hello world");

  return (
    <Wrapper>
      <FieldString
        label="Foobar"
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

