import antfu from '@antfu/eslint-config'
import jestDom from 'eslint-plugin-jest-dom'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactNative from 'eslint-plugin-react-native'
import testingLibrary from 'eslint-plugin-testing-library'

export default antfu(
  {
    react: true,
    typescript: true,
    formatters: true,
    ignores: [
      'apps/mobile/.storybook/storybook.requires.ts',
    ],
  },
  jsxA11y.flatConfigs.recommended,
  {
    name: 'jest-dom',
    files: [
      '**/*.test.ts?(x)',
    ],
    ...jestDom.configs['flat/recommended'],
  },
  {
    name: 'testing-library',
    files: [
      '**/*.test.ts?(x)',
    ],
    ...testingLibrary.configs['flat/react'],
  },
  {
    name: 'react native',
    files: [
      'packages/ui-mobile/**/*.tsx',
      'apps/mobile/**/*.tsx',
    ],
    plugins: { 'react-native': reactNative },
    rules: reactNative.configs.all.rules,
    languageOptions: { parserOptions: reactNative.configs.all.parserOptions },
  },
  {
    name: 'Custom Rules',
    // --- Custom Rule Overrides ---
    rules: {
      'perfectionist/sort-imports': ['error', {
        internalPattern: ['@victorli/.*', '~/.*'],
      }],
    },
  },
)
