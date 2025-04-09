import type { StorybookConfig } from '@storybook/react-native'

const main: StorybookConfig = {
  stories: ['../guis/*.stories.?(ts|tsx|js|jsx)', '../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
  ],
}

export default main
