var webpackConfig = require('./webpack.config.js');

// Karma configuration
module.exports = function(config) {
  var browsers = ['Chrome'];
  if (process.env.TRAVIS) {
    browsers = ['Firefox'];
  }

  config.set({
		browsers: browsers,
		frameworks: ['mocha'],
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
