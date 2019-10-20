const webpackProdConfig = require('./webpack.production.config');
const artifacts = require("../test/artifacts");

const OUTPATH = artifacts.pathSync("/profiling");

module.exports = {
  ...webpackProdConfig,
  output: {
    ...webpackProdConfig.output,
    path: OUTPATH,
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
