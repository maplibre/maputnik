import React from 'react';
import {useActionState} from './helper';
import InputCheckbox from '../src/components/InputCheckbox';
import {InputContainer} from './ui';

export default {
  title: 'InputCheckbox',
  component: InputCheckbox,
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

