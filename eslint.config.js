import eslint from "@eslint/js";
import stylisticTs from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default defineConfig({
  extends: [eslint.configs.recommended, tseslint.configs.recommended],
  files: ["**/*.{js,jsx,ts,tsx}"],
  ignores: ["dist/**/*"],
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: "module",
    globals: {
      global: "readonly",
    },
  },
  settings: {
    react: { version: "18.2" },
  },
  plugins: {
    react: reactPlugin,
    "react-hooks": reactHooksPlugin,
    "react-refresh": reactRefreshPlugin,
    "@stylistic": stylisticTs,
  },
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
    "no-unused-vars": "off",
    "react/prop-types": "off",
    "no-undef": "off",
    indent: "off",
    "@stylistic/indent": ["error", 2],
    semi: "off",
    "@stylistic/semi": ["error", "always"],
    quotes: "off",
    "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
    "no-var": "error",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { fixStyle: "inline-type-imports" },
    ],
  },
  linterOptions: {
    reportUnusedDisableDirectives: true,
    noInlineConfig: false,
  },
});
