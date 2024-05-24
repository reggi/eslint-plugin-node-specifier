const nativeModules = require('node:module').builtinModules

function isNodeSpecifier(moduleName) {
  return moduleName.startsWith('node:')
}

function isNativeModule(moduleName) {
  return nativeModules.includes(moduleName.replace(/^node:/, ''))
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow the use of node: specifier for native Node.js modules',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [], // no options,
    messages: {
      disallowNodeSpecifier: `Do not use 'node:{{name}}', use '{{name}}' instead`,
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const moduleName = node.source.value
        if (isNativeModule(moduleName) && isNodeSpecifier(moduleName)) {
          const name = moduleName.replace(/^node:/, '')
          context.report({
            node: node.source,
            messageId: 'disallowNodeSpecifier',
            data: {name},
            fix(fixer) {
              return fixer.replaceText(node.source, `'${name}'`)
            },
          })
        }
      },
      CallExpression(node) {
        if (
          node.callee.name === 'require' &&
          node.arguments.length === 1 &&
          typeof node.arguments[0].value === 'string'
        ) {
          const moduleName = node.arguments[0].value
          if (isNativeModule(moduleName) && isNodeSpecifier(moduleName)) {
            const name = moduleName.replace(/^node:/, '')
            context.report({
              node: node.arguments[0],
              messageId: 'disallowNodeSpecifier',
              data: {name},
              fix(fixer) {
                return fixer.replaceText(node.arguments[0], `'${name}'`)
              },
            })
          }
        }
      },
    }
  },
}
