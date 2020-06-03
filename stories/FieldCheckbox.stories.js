import React from 'react';
import {useActionState} from './helper';
import FieldCheckbox from '../src/components/FieldCheckbox';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldCheckbox',
  component: FieldCheckbox,
  decorators: [withA11y],
};


export const BasicUnchecked = () => {
  const [value, setValue] = useActionState("onChange", false);

  return (
    <Wrapper>
      <FieldCheckbox
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

export const BasicChecked = () => {
  const [value, setValue] = useActionState("onChange", true);

  return (
    <Wrapper>
      <FieldCheckbox
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

