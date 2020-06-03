import React from 'react';
import {useActionState} from './helper';
import FieldSymbol from '../src/components/FieldSymbol';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldSymbol',
  component: FieldSymbol,
  decorators: [withA11y],
};


export const Basic = () => {
  const icons = ["Bicycle", "Ski", "Ramp"];
  const [value, setValue] = useActionState("onChange", "Ski");

  return (
    <Wrapper>
      <FieldSymbol
        icons={icons}
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};


