module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'eslint:recommended',
    'prettier',
    'standard'
  ],
  ignorePatterns: ['**/dist/*'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'jsx-quotes': ['error', 'prefer-double'],
    'react/react-in-jsx-scope': 'off',
    'no-use-before-define': 'error',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^h$',
        varsIgnorePattern: '^h$'
      }
    ],
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'never'],
    semi: ['error', 'never'],
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }
    ],
    'no-param-reassign': ['error', { props: false }],
    'array-bracket-newline': ['error', 'consistent'],
    'array-element-newline': ['error', 'consistent'],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          minProperties: 3,
          multiline: true,
          consistent: true
        },
        ObjectPattern: {
          minProperties: 3,
          multiline: true,
          consistent: true
        },
        ImportDeclaration: {
          minProperties: 3,
          multiline: true,
          consistent: true
        },
        ExportDeclaration: {
          minProperties: 3,
          multiline: true,
          consistent: true
        }
      }
    ],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false
      }
    ],
    'space-before-function-paren': ['error', 'always'],
    // import
    'import/order': 'error',
    'import/first': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-default-export': 'off'
  },
  settings: {
    react: {
      version: '18'
    }
  }
}
