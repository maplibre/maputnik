import MapboxGl from 'mapbox-gl'

// Load mapbox-gl-rtl-text using object urls without needing http://localhost for AJAX.
const data = require("raw-loader?mimetype=text/javascript!@mapbox/mapbox-gl-rtl-text/mapbox-gl-rtl-text.js");

const blob = new window.Blob([data]);
const objectUrl = window.URL.createObjectURL(blob, {
  type: "text/javascript"
});

MapboxGl.setRTLTextPlugin(objectUrl);
