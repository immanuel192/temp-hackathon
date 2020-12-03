module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: 'vue-eslint-parser',
  extends: [
    "@vue/airbnb",
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    quotes: 0,
    'space-before-function-paren': 0,
    'import/no-extraneous-dependencies': 1,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    "max-len": 1,
    'import/prefer-default-export': 0,
    'no-await-in-loop': 0,
    'no-restricted-syntax': 0,
    '@typescript-eslint/camelcase': 0,
    'class-methods-use-this': 0,
  },
  overrides: [
    {
      files: [
        '**/*.spec.ts',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
