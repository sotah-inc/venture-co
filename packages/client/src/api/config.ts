import getConfig from "next/config";

interface IConfig {
  publicRuntimeConfig?: {
    publicApiEndpoint: string;
  };
  serverRuntimeConfig?: {
    publicServerApiEndpoint: string;
    privateServerApiEndpoint: string;
  };
}

const hostname: string = (() => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.hostname;
})();

const defaultApiEndpoint = "https://api.sotah.info";
export function getApiEndpoint(): string {
  const { publicRuntimeConfig, serverRuntimeConfig }: IConfig = getConfig();
  if (serverRuntimeConfig?.publicServerApiEndpoint) {
    return serverRuntimeConfig.publicServerApiEndpoint;
  }

  if (publicRuntimeConfig?.publicApiEndpoint) {
    return publicRuntimeConfig.publicApiEndpoint;
  }

  if (hostname === "localhost") {
    return defaultApiEndpoint;
  }

  return defaultApiEndpoint;
}

export function getPrivateApiEndpoint(): string | null {
  const { serverRuntimeConfig }: IConfig = getConfig();

  return serverRuntimeConfig?.privateServerApiEndpoint ?? null;
}
