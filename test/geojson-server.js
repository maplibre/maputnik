const cors       = require("cors");
const express    = require("express");
const fs         = require("fs");
const sourceData = require("./sources");


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
    "glyphs": "https://example.local/fonts/{fontstack}/{range}.pbf",
    "sprites": "https://example.local/fonts/{fontstack}/{range}.pbf",
    "layers": []
  }
}

function buildGeoJSONSource(data) {
  return {
    type: "vector",
    data: data
  };
}

function buildResterSource(req, key) {
  return {
    "tileSize": 256,
    "tiles": [
      req.protocol + '://' + req.get('host') + "/" + key + "/{x}/{y}/{z}"
    ],
    "type": "raster"
  };
}


app.get("/sources/raster/{x}/{y}/{z}", function(req, res) {
  res.status(404).end();
})

app.get("/styles/empty/:sources", function(req, res) {
  var reqSources = req.params.sources.split(",");

  var sources = {};
  reqSources.forEach(function(key) {
    var parts = key.split(":");
    var type = parts[0];
    var key = parts[1];

    if(type === "geojson") {
      sources[key] = buildGeoJSONSource(sourceData[key]);
    }
    else if(type === "raster") {
      sources[key] = buildResterSource(req, key);
    }
    else {
      console.error("ERR: Invalid type: %s", type);
      throw "Invalid type"
    }
  });

  var json = buildStyle({
    sources: sources
  });
  res.send(json);
})

app.get("/example-layer-style.json", function(req, res) {
  res.json(
    JSON.parse(
      fs.readFileSync(__dirname+"/example-layer-style.json").toString()
    )
  );
})

app.get("/example-style.json", function(req, res) {
  res.json(
    JSON.parse(
      fs.readFileSync(__dirname+"/example-style.json").toString()
    )
  );
})


module.exports = app;
