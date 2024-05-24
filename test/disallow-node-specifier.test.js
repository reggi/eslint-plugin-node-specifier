const t = require('tap')
const {RuleTester} = require('eslint')
const rule = require('../rules/disallow-node-specifier')

const ruleTester = new RuleTester()

t.test('disallow-node-specifier require', t => {
  ruleTester.run('disallow-node-specifier', rule, {
    valid: (() => {
      const items = []
      items.push(`
      const lodash = require('lodash')
      const path = require('path')
      `)
      return items.map(i => i.trim())
    })(),

    invalid: (() => {
      const items = []
      items.push({
        code: `
        const lodash = require('lodash')
        const path = require('node:path')
        `.trim(),
        output: `
        const lodash = require('lodash')
        const path = require('path')
        `.trim(),
        errors: [
          {
            // messageId: 'disallowNodeSpecifier',
            message: `Do not use 'node:path', use 'path' instead`,
            line: 2,
          },
        ],
      })

      return items
    })(),
  })
  t.end()
})

t.test('disallow-node-specifier import', t => {
  ruleTester.run('disallow-node-specifier', rule, {
    valid: (() => {
      const items = []
      items.push(`
      import lodash from 'lodash'
      import path from 'path'
      `)
      return items.map(i => i.trim())
    })(),

    invalid: (() => {
      const items = []
      items.push({
        code: `
        import lodash from 'lodash'
        import path from 'node:path'
        `.trim(),
        output: `
        import lodash from 'lodash'
        import path from 'path'
        `.trim(),
        errors: [
          {
            // messageId: 'disallowNodeSpecifier',
            message: `Do not use 'node:path', use 'path' instead`,
            line: 2,
          },
        ],
      })

      return items
    })(),
  })
  t.end()
})
