import React from 'react';
import {useActionState} from './helper';
import FieldFont from '../src/components/FieldFont';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldFont',
  component: FieldFont,
  decorators: [withA11y],
};


export const Basic = () => {
  const fonts = ["Comic Sans", "Helvectica", "Gotham"];
  const [value, setValue] = useActionState("onChange", ["Comic Sans"]);

  return (
    <Wrapper>
      <FieldFont
        fonts={fonts}
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

