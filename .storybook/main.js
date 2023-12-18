const config = {
  stories: ['../stories/**/*.stories.jsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-a11y/register', '@storybook/addon-storysource'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  }
};
export default config;
