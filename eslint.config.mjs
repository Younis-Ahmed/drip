import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'warn',
    'unicorn/prefer-node-protocol': 'off', // Next.js's webpack doesn't support node: protocol
  },
  ignores: ['dist', 'node_modules', 'tailwind.config.ts'],
  extends: ['next/core-web-vitals', 'next/typescript'],
  formatters: true,

})
