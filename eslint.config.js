import { configs } from '@eslint/js'
import { config, configs as _configs } from 'typescript-eslint'
import { configs as __configs, processInlineTemplates } from 'angular-eslint'

export default config(
  {
    files: ['**/*.ts'],
    extends: [
      configs.recommended,
      ..._configs.recommended,
      ...__configs.tsRecommended
    ],
    processor: processInlineTemplates,
    rules: {
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
      '@typescript-eslint/no-unused-vars': 'error',
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
      ...__configs.templateRecommended,
      ...__configs.templateAccessibility
    ],
    rules: {
      '@angular-eslint/template/eqeqeq': 'error'
    }
  }
)
