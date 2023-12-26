import React from 'react';
import {useActionState} from './helper';
import FieldCheckbox from '../src/components/FieldCheckbox';
import {Wrapper} from './ui';

export default {
  title: 'FieldCheckbox',
  component: FieldCheckbox,
};


export const BasicUnchecked = () => {
  const [value, setValue] = useActionState("onChange", false);

  return (
    <Wrapper>
      <FieldCheckbox
        label="Foobar"
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
        label="Foobar"
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

