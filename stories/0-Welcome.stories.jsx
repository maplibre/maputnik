import '../src/styles/index.scss';
import React from 'react';
import {Describe} from './ui';


export default {
  title: 'Welcome',
};

export const ToStorybook = () => {
  return (
    <Describe>
      <h1>Maputnik component library</h1>
      <p>
        This is the Maputnik component library, which shows the uses of some commonly used components from the Maputnik editor. This is a stand alone place where we can better refine them and improve their API separate from their use inside the editor.
      </p>
      <p>
        This should also help us better refine our CSS and make it more modular as currently we rely on the cascade quite a bit in a number of places.
      </p>
    </Describe>
  ); 
}

ToStorybook.story = {
  name: 'Intro',
};
