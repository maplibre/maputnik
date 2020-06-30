import React from 'react';
import {useActionState} from './helper';
import InputUrl from '../src/components/InputUrl';
import {InputContainer} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'InputUrl',
  component: InputUrl,
  decorators: [withA11y],
};


export const Valid = () => {
  const [value, setValue] = useActionState("onChange", "http://example.com");

  return (
    <InputContainer>
      <InputUrl
        value={value}
        onChange={setValue}
        onInput={setValue}
      />
    </InputContainer>
  );
};

export const Invalid = () => {
  const [value, setValue] = useActionState("onChange", "foo");

  return (
    <InputContainer>
      <InputUrl
        value={value}
        onChange={setValue}
        onInput={setValue}
      />
    </InputContainer>
  );
};


