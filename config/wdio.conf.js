var webpack          = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig    = require("./webpack.production.config");
var testConfig       = require("../test/config/specs");


var server;

exports.config = {
  specs: [
    './test/specs/**/*.js'
  ],
  exclude: [
  ],
  maxInstances: 10,
  capabilities: [{
    maxInstances: 5,
    browserName: 'firefox'
  }],
  sync: true,
  logLevel: 'verbose',
  coloredLogs: true,
  bail: 0,
  screenshotPath: './errorShots/',
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['phantomjs'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    // Because we don't know how long the initial build will take...
    timeout: 2*60*1000
  },
  onPrepare: function (config, capabilities) {
    var compiler = webpack(webpackConfig);
    server = new WebpackDevServer(compiler, {});
    server.listen(testConfig.port);
  },
  onComplete: function(exitCode) {
    server.close();
  }
}
