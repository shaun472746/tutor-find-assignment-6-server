import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  {
    ignores: [
      "node_modules/**", // Ignore the entire node_modules folder
      "dist/**", // Ignore the dist folder
      "build/**", // Ignore the build folder
    ],
  },
  {
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      eqeqeq: "off",
      "no-unused-vars": "error",
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
    },
  },
];