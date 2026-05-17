//TODO: move to a flat configuration
module.exports = {
  root: true,
  ignorePatterns: [],
  plugins: [
    '@nx',
    'react',
    '@typescript-eslint',
    'prettier',
    'simple-import-sort',
    'import',
  ],
  extends: [
    //
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    // use @typescript-eslint/eslint-plugin@7.x @typescript-eslint/parser@7.x, otherwise install the latest
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.base.json',
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 'off',
    'react/react-in-jsx-scope': 'off',
    'linebreak-style': 'error',
    'react/jsx-props-no-spreading': 'off',
    'no-console': 'error',
    'no-var': 'error',
    'react/jsx-sort-props': [
      'error',
      {
        shorthandFirst: true,
      },
    ],
    '@typescript-eslint/no-floating-promises': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'spaced-comment': ['error', 'always'],
    eqeqeq: ['error', 'smart'],
    'no-else-return': 'error',
    'no-empty-function': 'error',
    'react/require-default-props': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    'max-len': [
      'error',
      {
        code: 120,
      },
    ],
    'consistent-return': 'off',
    'array-callback-return': 'warn',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-loss-of-precision': 'off',
    'react/button-has-type': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    '@typescript-eslint/no-misused-promises': [
      2,
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
      {
        blankLine: 'always',
        prev: ['const', 'let', 'import'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['import'],
        next: ['import'],
      },
      {
        blankLine: 'never',
        prev: ['const', 'let'],
        next: ['const', 'let'],
      },
      {
        blankLine: 'always',
        prev: ['multiline-const', 'multiline-let'],
        next: ['*'],
      },
      {
        blankLine: 'always',
        prev: ['*'],
        next: ['multiline-const', 'multiline-let'],
      },
      {
        blankLine: 'always',
        prev: ['*'],
        next: ['if', 'switch', 'for', 'while', 'try', 'function', 'class'],
      },
      {
        blankLine: 'always',
        prev: ['if', 'switch', 'for', 'while', 'try', 'function', 'class'],
        next: ['*'],
      },
      {
        blankLine: 'never',
        prev: ['case'],
        next: ['case'],
      },
    ],
    'object-curly-spacing': [
      'error',
      'always',
      {
        objectsInObjects: true,
        arraysInObjects: true,
      },
    ],
    'array-bracket-spacing': [
      'error',
      'always',
      {
        objectsInArrays: true,
        arraysInArrays: false,
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Add internal packages showing on top, You can add "react-hook-form", "react-query" etc.
              ['^@nx', '^react', '^\\w'],
              // npm packages
              // Anything that starts with a letter (or digit or underscore), or `@` followed by a letter.
              // ["^\\w"],
              // Internal packages.
              ['^@store(/.*|$)'],
              ['^@components(/.*|$)'],
              ['^@ui(/.*|$)'],
              ['^@lib(/.*|$)'],
              ['^@pages(/.*|$)'],
              ['^@routes(/.*|$)'],
              ['^@layouts(/.*|$)'],
              ['^@utils(/.*|$)'],
              ['^@assets(/.*|$)'],
              ['^@helpers(/.*|$)'],
              ['^@hooks(/.*|$)'],
              ['^@providers(/.*|$)'],
              ['^@services(/.*|$)'],
              // Side effect imports.
              ['^\\u0000'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // Style imports.
              ['^.+\\.?(css)$'],
            ],
          },
        ],
        '@nx/enforce-module-boundaries': [
          'error',
          {
            enforceBuildableLibDependency: true,
            allow: [],
            depConstraints: [
              {
                sourceTag: '*',
                onlyDependOnLibsWithTags: ['*'],
              },
            ],
          },
        ],
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: ['plugin:@nx/typescript'],
      rules: {},
    },
    {
      files: ['*.js', '*.jsx'],
      extends: ['plugin:@nx/javascript'],
      rules: {},
    },
    {
      files: ['*.spec.ts', '*.spec.tsx', '*.spec.js', '*.spec.jsx'],
      env: {
        jest: true,
      },
      rules: {},
    },
  ],
};
