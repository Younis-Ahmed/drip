import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
  },
  ignores: ['dist', 'node_modules', 'tailwind.config.ts'],
  extends: ['next/core-web-vitals', 'next/typescript'],

})
