module.exports = {
  extends: ['../../.eslintrc.js'],
  ignorePatterns: ['!**/*', '.eslintrc.js', 'vite.config.ts', 'vite.config.*.ts'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: [
          'client-apps/fintech-playground/tsconfig.json',
          'client-apps/fintech-playground/tsconfig.app.json',
          'client-apps/fintech-playground/tsconfig.spec.json',
        ],
      },
      rules: {},
    },
    { files: ['*.js', '*.jsx'], rules: {} },
  ],
};
