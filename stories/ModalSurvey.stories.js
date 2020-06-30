import React from 'react';
import ModalSurvey from '../src/components/ModalSurvey';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'ModalSurvey',
  component: ModalSurvey,
  decorators: [withA11y],
};

export const Basic = () => (
  <Wrapper>
    <div style={{maxHeight: "200px"}}>
      <ModalSurvey
        isOpen={true}
      />
    </div>
  </Wrapper>
);







