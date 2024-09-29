// @ts-check

/** @type {import("prettier").Config} */
export default {
  semi: false,
  bracketSameLine: true,
  arrowParens: 'always',
  singleQuote: true,
  trailingComma: 'all',

  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  // https://www.jamesshopland.com/blog/sort-imports-with-prettier
  importOrder: [
    '<BUILTIN_MODULES>', // Node.js built-in modules
    '<THIRD_PARTY_MODULES>', // Imports not matched by other special words or groups.
    '',
    '^@7gui/(.*)$',
    '',
    '^~/lib/(.*)$',
    '^~/hooks/(.*)$',
    '^~/components/(.*)$',
    '^~/(.*)$',
    '',
    '^[./]', // relative imports
  ],
}
