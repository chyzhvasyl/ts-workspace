import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  { ignores: ['**/dist/**', 'webpack*.config.js'] },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: { 'class-methods-use-this': 'off' },
  },
];
