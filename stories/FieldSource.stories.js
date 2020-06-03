import React from 'react';
import {useActionState} from './helper';
import FieldSource from '../src/components/FieldSource';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldSource',
  component: FieldSource,
  decorators: [withA11y],
};


export const Basic = () => {
  const [value, setValue] = useActionState("onChange", "openmaptiles");

  return (
    <Wrapper>
      <FieldSource
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

