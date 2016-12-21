
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

// local css modules
loaders.push({
  test: /[\/\\]src[\/\\].*\.css/,
  loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
});

// local scss modules
loaders.push({
  test: /[\/\\]src[\/\\].*\.scss/,
  loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'sass')
});
// global css files
loaders.push({
  test: /[\/\\](node_modules|global)[\/\\].*\.css$/,
  loader: ExtractTextPlugin.extract('style', 'css')
});

module.exports = {
  entry: {
    app: './src/index.jsx',
    vendor: [
        'file-saver',
        'immutable',
        'mapbox-gl',
        //TODO: Cannot resolve migrations file?
        //"mapbox-gl-style-spec",
        "radium",
        "randomcolor",
        'react',
        "react-dom",
        "react-color",
        "react-file-reader-input",
        //TODO: Icons raise multi vendor errors?
        //"react-icons",
        // Open Layers
        'openlayers',
        'ol-mapbox-style'
    ]
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[chunkhash].app.js'
  },
  resolve: {
    alias: {
      'webworkify': 'webworkify-webpack',
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders,
    postLoaders: [{
      include: /node_modules\/mapbox-gl-shaders/,
      loader: 'transform',
      query: 'brfs'
    }]
  },
  node: {
    fs: "empty",
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', '[chunkhash].vendor.js'),
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
        drop_console: true,
        drop_debugger: true
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('[contenthash].css', {
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      title: 'Maputnik'
    }),
    new webpack.optimize.DedupePlugin()
  ]
};
