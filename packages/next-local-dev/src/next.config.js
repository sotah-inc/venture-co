const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  distDir: '../build',
  cssModules: true,
  cssLoaderOptions: {
    localIdentName: "[local]",
  }
});
