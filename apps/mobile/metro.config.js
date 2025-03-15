// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require('expo/metro-config')
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

// https://github.com/supabase/supabase-js/issues/1258#issuecomment-2664354021
config.resolver.unstable_conditionNames = ['require', 'default', 'browser']
config.resolver.unstable_enablePackageExports = true

module.exports = config
