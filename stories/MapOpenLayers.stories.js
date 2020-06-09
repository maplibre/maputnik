import React from 'react';
import MapOpenLayers from '../src/components/MapOpenLayers';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'MapOpenLayers',
  component: MapOpenLayers,
  decorators: [withA11y],
};

const mapStyle = {
  "version": 8,
  "sources": {
    "test1": {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [0, -10]
            },
            "properties": {}
          }
        ]
      }
    },
    "test2": {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [15, 10]
            },
            "properties": {}
          }
        ]
      }
    },
    "test3": {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [-15, 10]
            },
            "properties": {}
          }
        ]
      }
    }
  },
  "sprite": "",
  "glyphs": "https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "test1",
      "type": "circle",
      "source": "test1",
      "paint": {
        "circle-radius": 40,
        "circle-color": "red"
      }
    },
    {
      "id": "test2",
      "type": "circle",
      "source": "test2",
      "paint": {
        "circle-radius": 40,
        "circle-color": "green"
      }
    },
    {
      "id": "test3",
      "type": "circle",
      "source": "test3",
      "paint": {
        "circle-radius": 40,
        "circle-color": "blue"
      }
    }
  ]
}

export const Basic = () => {
  return <div style={{height: "100vh", width: "100vw", display: "flex"}}>
    <MapOpenLayers
      mapStyle={mapStyle}
      inspectModeEnabled={false}
      replaceAccessTokens={(s) => s}
      onChange={() => {}}
      debugToolbox={true}
    />
  </div>
};



