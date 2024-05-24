const nativeModules = require('node:module').builtinModules

function isNodeSpecifier(moduleName) {
  return moduleName.startsWith('node:')
}

function isNativeModule(moduleName) {
  return nativeModules.includes(moduleName)
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce the use of node: specifier for native Node.js modules',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [], // no options
    messages: {
      enforceNodeSpecifier: `Use 'node:{{name}}' instead of '{{name}}'`,
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const moduleName = node.source.value
        if (isNativeModule(moduleName) && !isNodeSpecifier(moduleName)) {
          context.report({
            node: node.source,
            messageId: 'enforceNodeSpecifier',
            data: {name: moduleName},
            fix(fixer) {
              return fixer.replaceText(node.source, `'node:${moduleName}'`)
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
          if (isNativeModule(moduleName) && !isNodeSpecifier(moduleName)) {
            context.report({
              node: node.arguments[0],
              messageId: 'enforceNodeSpecifier',
              data: {name: moduleName},
              fix(fixer) {
                return fixer.replaceText(node.arguments[0], `'node:${moduleName}'`)
              },
            })
          }
        }
      },
    }
  },
}
