import nx from '@nx/eslint-plugin';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const tsFiles = ['**/*.ts', '**/*.tsx'];

export default defineConfig([
  // Replaces .eslintignore
  {
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/.nx',
      '**/coverage',
      '**/*.d.ts',
      '**/*.mjs',
      '**/*.config.js',
    ],
  },

  ...nx.configs['flat/base'],

  // plugin:react/recommended + plugin:react/jsx-runtime (react-in-jsx-scope off)
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  // plugin:react-hooks/recommended
  reactHooks.configs.flat.recommended,
  // plugin:jsx-a11y/recommended
  jsxA11y.flatConfigs.recommended,
  // plugin:import/recommended
  importPlugin.flatConfigs.recommended,

  // plugin:@typescript-eslint/recommended + recommended-requiring-type-checking
  {
    files: tsFiles,
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    settings: { react: { version: 'detect' } },
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      // ─── React Compiler rules (eslint-plugin-react-hooks 7) ───
      // New in v7 and flag existing code; kept as warnings so error counts stay at the pre-upgrade baseline.
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/set-state-in-effect': 'warn',

      // ─── Import sorting ───
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/order': 'off',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-named-as-default': 'off',
      'import/no-unresolved': 'off',

      // ─── TypeScript ───
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/only-throw-error': 'error',

      // ─── JavaScript quality ───
      'no-console': 'error',
      'no-var': 'error',
      'no-void': ['error', { allowAsStatement: true }],
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
        {
          code: 120,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],

      // ─── React ───
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/button-has-type': 'off',
      'react/jsx-sort-props': ['error', { shorthandFirst: true, callbacksLast: true }],
      'react/jsx-one-expression-per-line': 'off',

      // ─── Formatting ───
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
  },

  // ── Import groups + Nx module boundaries ──
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^@angular', '^@ngrx', '^@nx'],
            ['^react', '^react-dom', '^react-router'],
            ['^@?\\w'],
            [
              '^@(store|components|ui|lib|pages|routes|layouts|utils|assets|helpers|hooks|providers|services)(/.*|$)',
            ],
            ['^\\u0000'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
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

  // eslintrc `overrides` ran after the root `rules`, so the Nx presets must come after them
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  // NestJS module files
  {
    files: ['**/*.module.ts'],
    rules: { 'max-classes-per-file': 'off', 'class-methods-use-this': 'off' },
  },

  // Webpack / build config files
  {
    files: ['**/webpack*.config.js', '**/webpack*.config.ts'],
    rules: {
      'import/no-import-module-exports': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },

  // Test files (Jest / Vitest)
  {
    files: ['**/*.spec.{ts,tsx,js,jsx}', '**/*.test.{ts,tsx}'],
    languageOptions: { globals: { ...globals.jest } },
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/require-await': 'off',
      'no-empty-function': 'off',
    },
  },

  // Must be last: disables rules that conflict with Prettier
  prettier,
]);
