import React from 'react';
import {useActionState} from './helper';
import InputColor from '../src/components/InputColor';
import {InputContainer} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'InputColor',
  component: InputColor,
  decorators: [withA11y],
};


export const Basic = () => {
  const [color, setColor] = useActionState("onChange", "#ff0000");

  return (
    <InputContainer>
      <InputColor
        label="Foobar"
        value={color}
        onChange={setColor}
      />
    </InputContainer>
  );
};

