const withStorybook = require('@storybook/react-native/metro/withStorybook')
// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require('expo/metro-config')
const path = require('node:path')
// const path = require('node:path')

// Create the default Expo config for Metro
// This includes the automatic monorepo configuration for workspaces
// See: https://docs.expo.dev/guides/monorepos/#automatic-configuration
const config = getDefaultConfig(__dirname)

// You can configure it manually as well, the most important parts are:
// const projectRoot = __dirname;
// const workspaceRoot = path.join(__dirname, '..', '..');
// #1 - Watch all files within the monorepo
// config.watchFolders = [workspaceRoot];
// #2 - Try resolving with project modules first, then hoisted workspace modules
// config.resolver.nodeModulesPaths = [
//   path.resolve(projectRoot, 'node_modules'),
//   path.resolve(workspaceRoot, 'node_modules'),
// ];

module.exports = withStorybook(config, {
  enabled: true,
  configPath: path.resolve(__dirname, './.storybook'),
})
