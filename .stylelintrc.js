module.exports = {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-order'],
  rules: {
    'order/properties-alphabetical-order': true,
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]+$',
      { message: 'Expected class selector to be camelCase (SCSS modules)' },
    ],
    'scss/dollar-variable-pattern': '^[a-z][a-zA-Z0-9]+$',
    'scss/at-mixin-pattern': '^[a-z][a-zA-Z0-9]+$',
    'declaration-empty-line-before': null,
    'no-empty-source': null,
  },
  ignoreFiles: ['node_modules/**', 'dist/**', '**/coverage/**'],
};
