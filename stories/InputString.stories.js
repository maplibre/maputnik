import React from 'react';
import {useActionState} from './helper';
import InputString from '../src/components/InputString';
import {InputContainer} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'InputString',
  component: InputString,
  decorators: [withA11y],
};


export const Basic = () => {
  const [value, setValue] = useActionState("onChange", "Hello world");

  return (
    <InputContainer>
      <InputString
        value={value}
        onChange={setValue}
      />
    </InputContainer>
  );
};

export const WithDefault = () => {
  const [value, setValue] = useActionState("onChange", null);

  return (
    <InputContainer>
      <InputString
        value={value}
        default={"Edit me..."}
        onChange={setValue}
      />
    </InputContainer>
  );
};

export const Multiline = () => {
  const [value, setValue] = useActionState("onChange", "Hello\nworld");

  return (
    <InputContainer>
      <InputString
        multi={true}
        value={value}
        onChange={setValue}
      />
    </InputContainer>
  );
};

export const MultilineWithDefault = () => {
  const [value, setValue] = useActionState("onChange", null);

  return (
    <InputContainer>
      <InputString
        multi={true}
        default={"Edit\nme.."}
        value={value}
        onChange={setValue}
      />
    </InputContainer>
  );
};

