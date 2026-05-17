// TODO: migrate to flat config (eslint.config.js) when all plugins support it
module.exports = {
  root: true,
  ignorePatterns: ['**/*'], // projects opt-in via "ignorePatterns": ["!**/*"]
  plugins: ['@nx', '@typescript-eslint', 'simple-import-sort', 'import', 'prettier'],
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier', // must be last — disables formatting rules that conflict with Prettier
  ],
  settings: {
    react: { version: 'detect' },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // ─── Import sorting ──────────────────────────────────────────────────────
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/order': 'off', // replaced by simple-import-sort
    'import/prefer-default-export': 'off', // named exports are fine
    'import/no-extraneous-dependencies': 'off', // managed by Nx module boundaries
    'import/no-named-as-default': 'off',

    // ─── TypeScript ──────────────────────────────────────────────────────────
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn', // warn instead of off — use sparingly
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
    ],
    '@typescript-eslint/no-floating-promises': 'error', // always handle promises
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: { attributes: false } },
    ],
    '@typescript-eslint/only-throw-error': 'error',


    // ─── JavaScript quality ──────────────────────────────────────────────────
    'no-console': 'error',
    'no-var': 'error',
    'no-void': ['error', { allowAsStatement: true }], // allow void for floating promises
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'no-else-return': 'error',
    'no-empty-function': 'error',
    eqeqeq: ['error', 'smart'],
    'spaced-comment': ['error', 'always'],
    'consistent-return': 'off',
    'array-callback-return': 'warn',
    'linebreak-style': ['error', 'unix'],
    'max-len': [
      'error',
      { code: 120, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true },
    ],

    // ─── React ───────────────────────────────────────────────────────────────
    'react/react-in-jsx-scope': 'off', // not needed in React 17+
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off', // TypeScript handles this
    'react/button-has-type': 'off',
    'react/jsx-sort-props': ['error', { shorthandFirst: true, callbacksLast: true }],
    'react/jsx-one-expression-per-line': 'off', // conflicts with Prettier

    // ─── Formatting (Prettier handles these, but keep consistent whitespace) ─
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'import'], next: '*' },
      { blankLine: 'any', prev: ['import'], next: ['import'] },
      { blankLine: 'never', prev: ['const', 'let'], next: ['const', 'let'] },
      { blankLine: 'always', prev: ['multiline-const', 'multiline-let'], next: ['*'] },
      { blankLine: 'always', prev: ['*'], next: ['multiline-const', 'multiline-let'] },
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
      { blankLine: 'never', prev: ['case'], next: ['case'] },
    ],
  },
  overrides: [
    // ── All TS/JS files: import groups + Nx module boundaries ─────────────────
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // 1. Angular & Nx (future Angular app support)
              ['^@angular', '^@ngrx', '^@nx'],
              // 2. React & other frameworks
              ['^react', '^react-dom', '^react-router'],
              // 3. All other external packages
              ['^@?\\w'],
              // 4. Internal path aliases (@store, @components, etc.)
              [
                '^@(store|components|ui|lib|pages|routes|layouts|utils|assets|helpers|hooks|providers|services)(/.*|$)',
              ],
              // 5. Side effect imports
              ['^\\u0000'],
              // 6. Parent imports
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // 7. Same-folder + index imports
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // 8. Style imports last
              ['^.+\\.s?css$'],
            ],
          },
        ],
        '@nx/enforce-module-boundaries': [
          'error',
          {
            enforceBuildableLibDependency: true,
            allow: [],
            depConstraints: [{ sourceTag: '*', onlyDependOnLibsWithTags: ['*'] }],
          },
        ],
      },
    },
    // ── TypeScript files: Nx TS rules ─────────────────────────────────────────
    {
      files: ['*.ts', '*.tsx'],
      extends: ['plugin:@nx/typescript'],
      rules: {},
    },
    // ── JavaScript files: Nx JS rules ─────────────────────────────────────────
    {
      files: ['*.js', '*.jsx'],
      extends: ['plugin:@nx/javascript'],
      rules: {},
    },
    // ── NestJS module files (service + module in one file is intentional) ─────
    {
      files: ['*.module.ts'],
      rules: {
        'max-classes-per-file': 'off',
        'class-methods-use-this': 'off',
      },
    },
    // ── Webpack / build config files ──────────────────────────────────────────
    {
      files: ['webpack*.config.js', 'webpack*.config.ts'],
      rules: {
        'import/no-import-module-exports': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
    // ── Test files (Jest / Vitest) ─────────────────────────────────────────────
    {
      files: [
        '*.spec.ts',
        '*.spec.tsx',
        '*.spec.js',
        '*.spec.jsx',
        '*.test.ts',
        '*.test.tsx',
      ],
      env: { jest: true },
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/require-await': 'off',
        'no-empty-function': 'off',
      },
    },
  ],
};
