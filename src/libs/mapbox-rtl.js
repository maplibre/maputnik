import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js'

// Load mapbox-gl-rtl-text using object urls without needing http://localhost for AJAX.
const data = require("base64?mimetype=text/javascript!@mapbox/mapbox-gl-rtl-text/mapbox-gl-rtl-text.js");

const blob = new window.Blob([window.atob(data)]);
const objectUrl = window.URL.createObjectURL(blob, {
  type: "text/javascript"
});

MapboxGl.setRTLTextPlugin(objectUrl);
