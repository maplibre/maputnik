import React from 'react';
import {useActionState} from './helper';
import FieldColor from '../src/components/FieldColor';
import {Wrapper} from './ui';

export default {
  title: 'FieldColor',
  component: FieldColor,
};


export const Simple = () => {
  const [color, setColor] = useActionState("onChange", "#ff0000");

  return (
    <Wrapper>
      <FieldColor
        name="color"
        value={color}
        onChange={setColor}
      />
    </Wrapper>
  );
};

