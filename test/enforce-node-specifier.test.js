const t = require('tap')
const {RuleTester} = require('eslint')
const rule = require('../rules/enforce-node-specifier')

const ruleTester = new RuleTester()

t.test('enforce-node-specifier require', t => {
  ruleTester.run('enforce-node-specifier', rule, {
    valid: (() => {
      const items = []
      items.push(`
      const lodash = require('lodash')
      const path = require('node:path')
      `)
      return items.map(i => i.trim())
    })(),

    invalid: (() => {
      const items = []
      items.push({
        code: `
        const lodash = require('lodash')
        const path = require('path')
        `.trim(),
        output: `
        const lodash = require('lodash')
        const path = require('node:path')
        `.trim(),
        errors: [
          {
            // messageId: 'enforceNodeSpecifier',
            message: `Use 'node:path' instead of 'path'`,
            line: 2,
          },
        ],
      })

      return items
    })(),
  })
  t.end()
})

t.test('enforce-node-specifier import', t => {
  ruleTester.run('enforce-node-specifier', rule, {
    valid: (() => {
      const items = []
      items.push(`
      import lodash from 'lodash'
      import path from 'node:path'
      `)
      return items.map(i => i.trim())
    })(),

    invalid: (() => {
      const items = []
      items.push({
        code: `
        import lodash from 'lodash'
        import path from 'path'
        `.trim(),
        output: `
        import lodash from 'lodash'
        import path from 'node:path'
        `.trim(),
        errors: [
          {
            // messageId: 'enforceNodeSpecifier',
            message: `Use 'node:path' instead of 'path'`,
            line: 2,
          },
        ],
      })

      return items
    })(),
  })
  t.end()
})
