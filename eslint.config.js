import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import {
  configs as angularConfigs,
  processInlineTemplates
} from 'angular-eslint'

export default tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...angularConfigs.tsRecommended
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    processor: processInlineTemplates,
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: false
        }
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
            accessors: 'explicit'
          }
        }
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' }
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' }
      ]
    }
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angularConfigs.templateRecommended,
      ...angularConfigs.templateAccessibility
    ],
    rules: {
      '@angular-eslint/template/eqeqeq': 'error'
    }
  }
)
