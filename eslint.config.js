import antfu from '@antfu/eslint-config'
import jestDom from 'eslint-plugin-jest-dom'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import testingLibrary from 'eslint-plugin-testing-library'

export default antfu(
  {
    ignores: [
      'apps/mobile/.storybook/storybook.requires.ts',
    ],
    formatters: true,
    react: true,
    typescript: true,
    ...jsxA11y.flatConfigs.recommended,
    rules: {
      'perfectionist/sort-imports': ['error', {
        internalPattern: ['@victorli/.*', '~/.*'],
      }],
    },
  },
  {
    files: [
      '**/*.test.ts?(x)',
    ],
    ...testingLibrary.configs['flat/react'],
    ...jestDom.configs['flat/recommended'],
  },
)
