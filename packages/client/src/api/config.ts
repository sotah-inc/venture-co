// tslint:disable-next-line:no-submodule-imports
import getConfig from "next/config";

interface IConfig {
  publicRuntimeConfig?: {
    publicApiEndpoint: string;
  };
  serverRuntimeConfig?: {
    serverApiEndpoint: string;
  };
}

const hostname: string = (() => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.hostname;
})();

const defaultApiEndpoint = "https://api.sotah.info";
export const getApiEndpoint: () => string = () => {
  const { publicRuntimeConfig, serverRuntimeConfig }: IConfig = getConfig();
  if (
    typeof serverRuntimeConfig !== "undefined" &&
    typeof serverRuntimeConfig.serverApiEndpoint !== "undefined"
  ) {
    return serverRuntimeConfig.serverApiEndpoint;
  }

  if (
    typeof publicRuntimeConfig !== "undefined" &&
    typeof publicRuntimeConfig.publicApiEndpoint !== "undefined"
  ) {
    return publicRuntimeConfig.publicApiEndpoint;
  }

  if (hostname === "localhost") {
    return defaultApiEndpoint;
  }

  return defaultApiEndpoint;
};
