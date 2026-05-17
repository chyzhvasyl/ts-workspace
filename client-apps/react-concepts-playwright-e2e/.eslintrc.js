module.exports = {
  extends: ['plugin:playwright/recommended', '../../.eslintrc.js'],
  ignorePatterns: ['!**/*', '.eslintrc.js'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['client-apps/react-concepts-playwright-e2e/tsconfig.json'],
      },
      rules: {},
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
    {
      files: ['src/**/*.{ts,js,tsx,jsx}'],
      rules: {},
    },
  ],
};
