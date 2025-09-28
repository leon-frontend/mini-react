import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default [
  // 忽略的文件和目录
  {
    ignores: [
      'node_modules/**',
      '**/node_modules/**',
      'dist/**',
      '**/dist/**',
      'build/**',
      '**/build/**',
      'coverage/**',
      '*.min.js',
      'pnpm-lock.yaml',
    ],
  },

  // 基础 JavaScript 推荐配置
  js.configs.recommended,

  // TypeScript 推荐配置
  ...tseslint.configs.recommended,

  // JavaScript 文件配置
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
  },

  // TypeScript 文件配置
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // TypeScript 规则
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'error',

      // React 规则
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // React 17+ 不需要导入 React
      'react/prop-types': 'off', // 使用 TypeScript 进行类型检查

      // 通用规则
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // 使用 TypeScript 版本
      'prefer-const': 'error',
      'no-var': 'error',

      // 与 Prettier 兼容的规则（禁用分号相关规则）
      semi: 'off',
      '@typescript-eslint/semi': 'off',
    },
  },

  // 测试文件特殊配置
  {
    files: ['**/*.{test,spec}.{js,ts,tsx}', '**/__test__/**/*.{js,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // Examples 目录特殊配置
  {
    files: ['examples/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
  },

  // Prettier 配置（必须放在最后）
  prettier,
]
