var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var artifacts = require("../test/artifacts");

var OUTPATH = artifacts.pathSync("/build");

module.exports = {
  entry: {
    app: './src/index.jsx',
    vendor: [
        'file-saver',
        'mapbox-gl/dist/mapbox-gl.js',
        "lodash.clonedeep",
        "lodash.throttle",
        'color',
        'react',
        "react-dom",
        "react-color",
        "react-file-reader-input",
        "react-collapse",
        "react-height",
        "react-icon-base",
        "react-motion",
        "react-sortable-hoc",
        "request",
        //TODO: Icons raise multi vendor errors?
        //"react-icons",
    ]
  },
  output: {
    path: OUTPATH,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    noParse: [
      /mapbox-gl\/dist\/mapbox-gl.js/,
      /openlayers\/dist\/ol.js/
    ],
    loaders
  },
  node: {
    fs: "empty",
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: '[chunkhash].vendor.js' }),
    new WebpackCleanupPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
      }
    }),
    new ExtractTextPlugin('[contenthash].css', {
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      title: 'Maputnik'
    })
  ]
};
