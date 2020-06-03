import React from 'react';
import {useActionState} from './helper';
import FieldColor from '../src/components/FieldColor';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldColor',
  component: FieldColor,
  decorators: [withA11y],
};


export const Basic = () => {
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

