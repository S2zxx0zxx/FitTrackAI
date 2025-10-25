import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

const testOverrides = {
  files: ['**/*.test.js', '**/*.test.jsx', '**/setupTests.js'],
  languageOptions: {
    globals: {
      ...globals.browser,
      describe: 'readonly',
      test: 'readonly',
      it: 'readonly',
      expect: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly',
      vi: 'readonly',
      beforeAll: 'readonly',
      afterAll: 'readonly',
    },
  },
  rules: {
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true,
      // Components rendered in tests are used implicitly via JSX
      varsIgnorePattern: '^(React|\\w+Component|\\w+List|\\w+Input|\\w+View)$'
    }],
  },
};

export default [
  {
    ignores: ['dist', 'node_modules', 'coverage', '.backups'],
  },
  js.configs.recommended,
  {
    plugins: { react, 'react-hooks': reactHooks },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-unescaped-entities': 'error',
    },
  },
  testOverrides,
];
