var webpackConfig = require('./webpack.config.js');

// Karma configuration
module.exports = function(config) {
  config.set({
		browsers: [ 'Chrome' ], //run in Chrome
		frameworks: [ 'mocha' ], //use the mocha test framework
    // ... normal karma configuration
    files: [
      // all files ending in "_test"
      {pattern: 'test/*_test.js', watched: false},
      {pattern: 'test/**/*_test.js', watched: false}
      // each file acts as entry point for the webpack configuration
    ],

    preprocessors: {
      // add webpack as preprocessor
      'test/*_test.js': ['webpack'],
      'test/**/*_test.js': ['webpack']
    },

    webpack: webpackConfig,
    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    }
  });
};
