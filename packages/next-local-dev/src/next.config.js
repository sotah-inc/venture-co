const withCSS = require('@zeit/next-css');
const sotahCore = require("@sotah-inc/core");

module.exports = withCSS({
  distDir: '../build',
  cssModules: true,
  cssLoaderOptions: {
    localIdentName: "[local]",
  },
  publicRuntimeConfig: {
    publicApiEndpoint: "https://api.sotah.info"
  },
  serverRuntimeConfig: {
    serverApiEndpoint: sotahCore.getEnvVar("API_ENDPOINT")
  }
});
