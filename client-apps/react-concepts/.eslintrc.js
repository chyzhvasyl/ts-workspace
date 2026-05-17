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
          'client-apps/react-concepts/tsconfig.json',
          'client-apps/react-concepts/tsconfig.app.json',
          'client-apps/react-concepts/tsconfig.spec.json',
        ],
      },
      rules: {},
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
};
