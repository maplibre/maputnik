import React from 'react';
import {useActionState} from './helper';
import InputColor from '../src/components/InputColor';
import {InputContainer} from './ui';

export default {
  title: 'InputColor',
  component: InputColor,
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

