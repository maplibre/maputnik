import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['dist/**'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        global: 'readonly'
      }
    },
    settings: {
      react: { version: '16.4' }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      '@typescript-eslint/no-unused-vars': [
        'off',
        { argsIgnorePattern: '^_' }
      ],
      'no-unused-vars': 'off',
      'react/prop-types': 'off',
      'no-undef': 'off',
      'indent': ['error', 2],
      'no-var': 'error'
    }
  }
];
