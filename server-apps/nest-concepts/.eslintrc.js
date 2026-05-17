module.exports = {
  extends: ['../../.eslintrc.js'],
  ignorePatterns: ['!**/*', '.eslintrc.js', '**/dist/**', 'webpack*.config.js'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: [
          'server-apps/nest-concepts/tsconfig.json',
          'server-apps/nest-concepts/tsconfig.app.json',
          'server-apps/nest-concepts/tsconfig.spec.json',
        ],
      },
      rules: {
        'class-methods-use-this': 'off',
      },
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
};
