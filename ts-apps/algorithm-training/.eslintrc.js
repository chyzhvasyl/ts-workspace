module.exports = {
  extends: ['../../.eslintrc.js'],
  ignorePatterns: ['!**/*', '.eslintrc.js'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {},
    },
    {
      files: ['*.ts'],
      parserOptions: {
        project: [
          'ts-apps/algorithm-training/tsconfig.json',
          'ts-apps/algorithm-training/tsconfig.app.json',
          'ts-apps/algorithm-training/tsconfig.spec.json',
        ],
      },
      rules: {
        'no-continue': 'off',
        'class-methods-use-this': 'off',
        'no-underscore-dangle': 'off',
        'no-console': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unsafe-function-type': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-loop-func': 'off',
        '@typescript-eslint/default-param-last': 'off',
        '@typescript-eslint/no-redeclare': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        'no-return-assign': 'off',
        'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
      },
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
};
