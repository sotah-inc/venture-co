interface IConfig {
  publicRuntimeConfig?: {
    publicApiEndpoint: string;
  };
  serverRuntimeConfig?: {
    publicServerApiEndpoint: string;
    privateServerApiEndpoint: string;
  };
}

let config: IConfig | null = null;

export function setConfig(foundConfig: IConfig): void {
  config = foundConfig;
}

const hostname: string = (() => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.hostname;
})();

const defaultApiEndpoint = "https://api.sotah.info";
export function getApiEndpoint(): string {
  if (!config) {
    return defaultApiEndpoint;
  }

  const { publicRuntimeConfig, serverRuntimeConfig } = config;

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
  if (!config) {
    return null;
  }

  const { serverRuntimeConfig } = config;

  return serverRuntimeConfig?.privateServerApiEndpoint ?? null;
}
