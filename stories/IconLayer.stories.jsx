import React from 'react';
import IconLayer from '../src/components/IconLayer';
import {Wrapper} from './ui';


export default {
  title: 'IconLayer',
  component: IconLayer,
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






