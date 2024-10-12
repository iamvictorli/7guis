// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const path = require('node:path')

// Find the project and workspace directories
const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot)

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot]
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// config.transformer.getTransformOptions = async () => ({
//   transform: {
//     // Inline requires are very useful for deferring loading of large dependencies/components.
//     // For example, we use it in app.tsx to conditionally load Reactotron.
//     // However, this comes with some gotchas.
//     // Read more here: https://reactnative.dev/docs/optimizing-javascript-loading
//     // And here: https://github.com/expo/expo/issues/27279#issuecomment-1971610698
//     inlineRequires: true,
//   },
// })

// This helps support certain popular third-party libraries
// such as Firebase that use the extension cjs.
// config.resolver.sourceExts.push('cjs')

module.exports = config
