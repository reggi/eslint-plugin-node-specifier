const globals = require('globals')
const nodeSpecifier = require('./index.js')

module.exports = [
  {files: ['**/*.js'], languageOptions: {sourceType: 'commonjs'}},
  {languageOptions: {globals: globals.node}},
  {
    plugins: {
      'node-specifier': nodeSpecifier,
    },
    rules: {
      // "node-specifier/disable-node-specifier": "error",
      'node-specifier/enforce-node-specifier': 'error',
    },
  },
]
