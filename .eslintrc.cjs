module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', { semi: false, singleQuote: true, printWidth: 120 }],
  },
}
