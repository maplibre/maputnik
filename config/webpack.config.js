"use strict";
var webpack = require('webpack');
var path = require('path');
var rules = require('./webpack.rules');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "8888";

module.exports = {
  target: 'web',
  mode: 'development',
  entry: [
    `webpack-dev-server/client?http://${HOST}:${PORT}`,
    `webpack/hot/only-dev-server`,
    `./src/index.jsx` // Your appʼs entry point
  ],
  devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map',
  output: {
    path: path.join(__dirname, '..', 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    noParse: [
      /mapbox-gl\/dist\/mapbox-gl.js/
    ],
    rules: rules
  },
  node: {
    fs: "empty",
    net: 'empty',
    tls: 'empty'
  },
  devServer: {
    contentBase: "./public",
    // do not print bundle build stats
    noInfo: true,
    // enable HMR
    hot: true,
    // embed the webpack-dev-server runtime into the bundle
    inline: true,
    // serve index.html in place of 404 responses to allow HTML5 history
    historyApiFallback: true,
    port: PORT,
    host: HOST,
    watchOptions: {
      // Disabled polling by default as it causes lots of CPU usage and hence drains laptop batteries. To enable polling add WEBPACK_DEV_SERVER_POLLING to your environment
      // See <https://webpack.js.org/configuration/watch/#watchoptions-poll> for details
      poll: (!!process.env.WEBPACK_DEV_SERVER_POLLING ? true : false),
      watch: false
    }
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Maputnik',
      template: './src/template.html'
    }),
    new HtmlWebpackInlineSVGPlugin({
      runPreEmit: true,
    }),
    new CopyWebpackPlugin([
      {
        from: './src/manifest.json',
        to: 'manifest.json'
      }
    ])
  ]
};
