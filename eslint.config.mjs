import { config } from '@leandromatos/eslint-config'

/**
 * @type {import('eslint').Linter.Config}
 */
export default [
  ...config,
  {
    ignores: ['docs', 'lib'],
  },
]
