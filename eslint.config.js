import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
  ],
  files: ['**/*.{js,jsx,ts,tsx}'],
  ignores: [
    "dist/**/*",
  ],
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    globals: {
      global: 'readonly'
    }
  },
  settings: {
    react: { version: '18.2' }
  },
  plugins: {
    'react': reactPlugin,
    'react-hooks': reactHooksPlugin,
    'react-refresh': reactRefreshPlugin
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    "@typescript-eslint/no-explicit-any": "off",
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }
    ],
    'no-unused-vars': 'off',
    'react/prop-types': 'off',
    'no-undef': 'off',
    'indent': ['error', 2],
    'no-var': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',

  },
  linterOptions: {
    reportUnusedDisableDirectives: true,
    noInlineConfig: false
  }
}
)
