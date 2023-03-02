module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['packages/**/*.ts', 'packages/**/*.tsx'],
      rules: {
        '@typescript-eslint/no-empty-function': 0
      }
    }
  ],
  rules: {
    /**
     * off 或 0：表示不验证规则。
     * warn 或 1：表示验证规则，当不满足时，给警告
     * error 或 2 ：表示验证规则，不满足时报错
     */
    // 关闭两个 ESLint 核心规则，与 Prettier 有冲突
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off'
  }
};
