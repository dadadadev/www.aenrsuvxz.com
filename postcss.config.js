module.exports = ctx => ({
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    // 'postcss-custom-properties': {},
    'autoprefixer': {},
    'cssnano': ctx.env === 'production' ? { autoprefixer: false } : false
  }
})
