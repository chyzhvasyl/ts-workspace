module.exports = {
  extends: ['../../.eslintrc.js'],
  ignorePatterns: ['!**/*', '.eslintrc.js'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['client-apps/react-concepts-cypress-e2e/tsconfig.json'],
      },
      rules: {},
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
};
