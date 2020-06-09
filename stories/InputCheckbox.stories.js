import React from 'react';
import {useActionState} from './helper';
import InputCheckbox from '../src/components/InputCheckbox';
import {InputContainer} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'InputCheckbox',
  component: InputCheckbox,
  decorators: [withA11y],
};


export const BasicUnchecked = () => {
  const [value, setValue] = useActionState("onChange", false);

  return (
    <InputContainer>
      <InputCheckbox
        label="Foobar"
        value={value}
        onChange={setValue}
      />
    </InputContainer>
  );
};

export const BasicChecked = () => {
  const [value, setValue] = useActionState("onChange", true);

  return (
    <InputContainer>
      <InputCheckbox
        label="Foobar"
        value={value}
        onChange={setValue}
      />
    </InputContainer>
  );
};

