var config = {};
var testNetwork = process.env.TEST_NETWORK || "localhost";

config.port = 9001;
config.baseUrl = "http://"+testNetwork+":"+config.port;

module.exports = config;
