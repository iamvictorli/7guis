import antfu from '@antfu/eslint-config'
import jestDom from 'eslint-plugin-jest-dom'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tailwind from 'eslint-plugin-tailwindcss'
import testingLibrary from 'eslint-plugin-testing-library'

export default antfu(
  {
    formatters: true,
    react: true,
    typescript: true,
  },
  ...tailwind.configs['flat/recommended'],
  jsxA11y.flatConfigs.recommended,
  {
    files: [
      '**/*.test.ts?(x)',
    ],
    ...testingLibrary.configs['flat/react'],
    ...jestDom.configs['flat/recommended'],
  },
  {
    rules: {
      'perfectionist/sort-imports': ['error', {
        internalPattern: ['@7gui/.*', '~/.*'],
      }],
    },
  },
)
