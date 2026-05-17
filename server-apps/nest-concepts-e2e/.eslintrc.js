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
        project: [
          'server-apps/nest-concepts-e2e/tsconfig.json',
          'server-apps/nest-concepts-e2e/tsconfig.spec.json',
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
