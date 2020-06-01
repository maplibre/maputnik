import React, {useState} from 'react';
import {action} from '@storybook/addon-actions';

export function useActionState (name, initialVal) {
  const [val, fn] = useState(initialVal);
  const actionFn = action(name);
  function retFn(val) {
    actionFn(val);
    return fn(val);
  }
  return [val, retFn];
}
