import MapboxGl from 'mapbox-gl'
import {readFileSync} from 'fs'

const data = readFileSync(__dirname+"/../../node_modules/@mapbox/mapbox-gl-rtl-text/mapbox-gl-rtl-text.js", "utf8");

const blob = new window.Blob([data], {
  type: "text/javascript"
});
const objectUrl = window.URL.createObjectURL(blob);

MapboxGl.setRTLTextPlugin(objectUrl);
