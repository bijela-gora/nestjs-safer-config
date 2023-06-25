module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    project: "tsconfig.build.json",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
  ],
  rules: {
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "off",
  },
  overrides: [
    {
      files: ["src/**/*.spec.ts"],
      excludedFiles: "*.test.js",
      parserOptions: {
        project: "tsconfig.test.json",
      },
    },
  ],
};
