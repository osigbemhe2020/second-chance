module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    semi: ['warn', 'always'], // or 'off'
    quotes: ['warn', 'single'],
    'no-unused-vars': ['warn'],
    indent: ['warn', 2],
    'comma-spacing': ['warn', { before: false, after: true }],
    'object-curly-spacing': ['warn', 'always'],
    'no-multiple-empty-lines': ['warn', { max: 1 }]
  }
};

