module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    '@typescript-eslint',
    'unused-imports',
    'simple-import-sort',
    'import',
    'sort-keys-fix',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    camelcase: 'warn',
    eqeqeq: [
      'error',
      'always',
      {
        null: 'ignore',
      },
    ],
    'import/newline-after-import': 'error',
    'no-else-return': 'warn',
    'no-useless-return': 'warn',
    'no-var': 'error',
    'object-shorthand': 'warn',
    'prefer-const': 'error',
    'prefer-template': 'warn',
    'import/no-duplicates': [
      'error',
      {
        considerQueryString: true,
      },
    ],
    'no-async-promise-executor': 'warn',
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
    'react/react-in-jsx-scope': 'off',
    semi: ['error', 'always'],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-keys-fix/sort-keys-fix': [
      'error',
      'asc',
      {
        caseSensitive: true,
        natural: true,
      },
    ],
    'spaced-comment': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        vars: 'all',
        varsIgnorePattern: '^_',
      },
    ],
    quotes: [
      'warn',
      'single',
      {
        avoidEscape: true,
      },
    ],
    yoda: 'warn',
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: ['multiline-block-like', 'multiline-expression'],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
    ],
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],
  },
};
