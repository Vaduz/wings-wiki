module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['warn', { semi: false, singleQuote: true, printWidth: 120 }],
  },
}
