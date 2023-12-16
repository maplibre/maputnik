const webpackProdConfig = require('./webpack.production.config');
var path = require('path');

module.exports = {
  ...webpackProdConfig,
  output: {
    ...webpackProdConfig.output,
    path: path.join(__dirname, '..', 'build', 'profiling'),
  },
  resolve: {
    ...webpackProdConfig.resolve,
    alias: {
      ...webpackProdConfig.resolve.alias,
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    }
  }
};
