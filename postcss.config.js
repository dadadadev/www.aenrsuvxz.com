module.exports = ctx => ({
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'autoprefixer': {},
    'cssnano': ctx.env === 'production' ? { autoprefixer: false, normalizeUrl: { stripWWW: false } } : false
  }
});
