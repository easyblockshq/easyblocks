module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "unused-imports"],
  rules: {
    "no-constant-condition": ["error", { checkLoops: false }],
    "no-empty-function": "off",
    "no-prototype-builtins": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/ban-ts-comment": ["warn"],
    "unused-imports/no-unused-imports": "error",
  },
  globals: {
    describe: "readonly",
    it: "readonly",
    test: "readonly",
    expect: "readonly",
  },
};
