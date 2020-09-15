// tslint:disable-next-line:no-import-side-effect
import "isomorphic-fetch";
import getConfig from "next/config";
import queryString from "query-string";

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

export interface IGatherOptions<T> {
  headers?: Headers;
  body?: T;
  method?: string;
  url: string | Array<string | undefined>;
}

export interface IGatherQueryOptions<Q, B> {
  headers?: Headers;
  body?: B;
  query?: Q;
  method?: string;
  url: string | Array<string | undefined>;
}

export interface IGatherResult<T> {
  response: Response;
  body: T | null;
  status: number;
}

export const gather = async <T, A>(opts: IGatherOptions<T>): Promise<IGatherResult<A>> => {
  const body = typeof opts.body === "undefined" ? null : JSON.stringify(opts.body);
  const method = typeof opts.method === "undefined" ? "GET" : opts.method;
  const headers: Headers = (() => {
    if (typeof opts.headers === "undefined") {
      return new Headers({ "content-type": "application/json" });
    }

    return opts.headers;
  })();

  const resolvedUrl = typeof opts.url === "string" ? opts.url : opts.url.filter(v => !!v).join("/");

  const response = await fetch(resolvedUrl, {
    body,
    cache: "default",
    headers,
    method,
  });

  return handleResponse(response);
};

export const gatherWithQuery = async <Q, A, B = {}>(
  opts: IGatherQueryOptions<Q, B>,
): Promise<IGatherResult<A>> => {
  const body = typeof opts.body === "undefined" ? null : JSON.stringify(opts.body);
  const query =
    typeof opts.query === "undefined"
      ? null
      : queryString.stringify(opts.query, { arrayFormat: "index" });
  const method = typeof opts.method === "undefined" ? "GET" : opts.method;
  const headers: Headers = (() => {
    if (typeof opts.headers === "undefined") {
      return new Headers({ "content-type": "application/json" });
    }

    return opts.headers;
  })();

  const url = (() => {
    const resolvedUrl =
      typeof opts.url === "string" ? opts.url : opts.url.filter(v => !!v).join("/");

    if (query === null) {
      return resolvedUrl;
    }

    return `${resolvedUrl}?${query}`;
  })();

  const response = await fetch(url, {
    body,
    cache: "default",
    headers,
    method,
  });

  return handleResponse(response);
};

const handleResponse = async <A>(response: Response): Promise<IGatherResult<A>> => {
  const responseBody: A | null = await (async () => {
    const responseText = await response.text();
    if (responseText.length === 0) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (contentType === null) {
      return null;
    }

    if (!/^application\/json/.test(contentType)) {
      return null;
    }

    return JSON.parse(responseText);
  })();

  return {
    body: responseBody,
    response,
    status: response.status,
  };
};
