import React from 'react';
import {useActionState} from './helper';
import FieldColor from '../src/components/FieldColor';
import {Wrapper} from './ui';

export default {
  title: 'FieldColor',
  component: FieldColor,
};


export const Basic = () => {
  const [color, setColor] = useActionState("onChange", "#ff0000");

  return (
    <Wrapper>
      <FieldColor
        label="Foobar"
        value={color}
        onChange={setColor}
      />
    </Wrapper>
  );
};

