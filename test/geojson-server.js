var cors       = require("cors");
var express    = require("express");
var fs         = require("fs");
var sourceData = require("./sources");


var app = express();

app.use(cors());


function buildStyle(opts) {
  opts = opts || {};
  opts = Object.assign({
    sources: {}
  }, opts);

  return {
    "id": "test-style",
    "version": 8,
    "name": "Test Style",
    "metadata": {
      "maputnik:renderer": "mbgljs"
    },
    "sources": opts.sources,
    "glyphs": "https://demo.tileserver.org/fonts/{fontstack}/{range}.pbf",
    "sprites": "https://demo.tileserver.org/fonts/{fontstack}/{range}.pbf",
    "layers": []
  }
}

function buildGeoJSONSource(data) {
  return {
    type: "geojson",
    data: data
  };
}


app.get("/styles/empty/:sources", function(req, res) {
  var reqSources = req.params.sources.split(",");

  var sources = {};
  reqSources.forEach(function(key) {
    sources[key] = buildGeoJSONSource(sourceData[key]);
  });

  var json = buildStyle({
    sources: sources
  });

  res.send(json);
})


module.exports = app;
