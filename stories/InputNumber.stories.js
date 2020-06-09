import React from 'react';
import {useActionState} from './helper';
import InputNumber from '../src/components/InputNumber';
import {InputContainer} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'InputNumber',
  component: InputNumber,
  decorators: [withA11y],
};

export const Basic = () => {
  const [value, setValue] = useActionState("onChange", 1);

  return (
    <InputContainer>
      <InputNumber
        name="number"
        value={value}
        onChange={setValue}
      />
    </InputContainer>
  );
};

export const Range = () => {
  const [value, setValue] = useActionState("onChange", 1);

  return (
    <InputContainer>
      <InputNumber
        name="number"
        value={value}
        onChange={setValue}
        min={1}
        max={24}
        allowRange={true}
        rangeStep={1}
      />
    </InputContainer>
  );
};

