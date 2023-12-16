const webpackProdConfig = require('./webpack.production.config');

module.exports = {
  ...webpackProdConfig,
  output: {
    ...webpackProdConfig.output,
    path: "./build/profiling/",
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
