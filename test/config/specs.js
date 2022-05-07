var config = {};
config.testNetwork = process.env.TEST_NETWORK || "localhost";
config.port = 9001;
config.baseUrl = "http://"+config.testNetwork+":"+config.port;

module.exports = config;
