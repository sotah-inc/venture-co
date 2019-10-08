const withCSS = require('@zeit/next-css');
const sotahServer = require("@sotah-inc/server");

module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    localIdentName: "[local]",
  },
  publicRuntimeConfig: {
    publicApiEndpoint: sotahServer.getConfig("public_api_endpoint", "PUBLIC_API_ENDPOINT")
  },
  serverRuntimeConfig: {
    serverApiEndpoint: sotahServer.getConfig("server_api_endpoint", "SERVER_API_ENDPOINT")
  }
});
