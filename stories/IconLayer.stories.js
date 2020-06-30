import React from 'react';
import IconLayer from '../src/components/IconLayer';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'IconLayer',
  component: IconLayer,
  decorators: [withA11y],
};

export const IconList = () => {
  const types = [
    'fill-extrusion',
    'raster',
    'hillshade',
    'heatmap',
    'fill',
    'background',
    'line',
    'symbol',
    'circle',
    'INVALID',
  ]

  return <Wrapper>
    <table style={{textAlign: "left"}}>
      <thead style={{borderBottom: "solid 1px white"}}>
        <tr>
          <td>ID</td>
          <td>Preview</td>
        </tr>
      </thead>
      <tbody>
        {types.map(type => (
          <tr>
            <td style={{paddingRight: "1em"}}>
              <code>{type}</code>
            </td>
            <td>
              <IconLayer type={type} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Wrapper>
};






