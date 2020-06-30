const rules = require('../config/webpack.rules');

module.exports = {
  stories: ['../stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-a11y/register',
    '@storybook/addon-storysource',
  ],
  webpackFinal: async config => {
    // do mutation to the config
    console.log("config.module", config.module);

    return {
      ...config,
      module: {
        rules: [
          ...rules,
        ]
      }
    };
  },
};
