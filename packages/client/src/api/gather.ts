import "isomorphic-fetch";
import log from "loglevel";
import queryString, { StringifiableRecord } from "query-string";

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

export async function gather<T, A>(opts: IGatherOptions<T>): Promise<IGatherResult<A>> {
  const body = typeof opts.body === "undefined" ? null : JSON.stringify(opts.body);
  const method = typeof opts.method === "undefined" ? "GET" : opts.method;
  const headers: Headers = (() => {
    if (typeof opts.headers === "undefined") {
      return new Headers({ "content-type": "application/json" });
    }

    return opts.headers;
  })();

  const resolvedUrl = typeof opts.url === "string" ? opts.url : opts.url.filter(v => !!v).join("/");

  return handleRequest(resolvedUrl, body, headers, method);
}

export async function gatherWithQuery<Q, A, B = unknown>(
  opts: IGatherQueryOptions<Q, B>,
): Promise<IGatherResult<A>> {
  const body = typeof opts.body === "undefined" ? null : JSON.stringify(opts.body);
  const query =
    typeof opts.query === "undefined"
      ? null
      : queryString.stringify((opts.query as unknown) as StringifiableRecord, {
        arrayFormat: "index",
      });
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

  return handleRequest(url, body, headers, method);
}

async function handleRequest<T>(
  url: string,
  body: string | null,
  headers: Headers,
  method: string,
): Promise<IGatherResult<T>> {
  log.debug("handling request", {
    url,
    body,
    headers: JSON.stringify(headers),
    method,
  });

  const response = await fetch(url, {
    body,
    cache: "default",
    headers,
    method,
  });

  return handleResponse(response);
}

async function handleResponse<A>(response: Response): Promise<IGatherResult<A>> {
  const responseText = await response.text();

  log.debug("received response", {
    url: response.url,
    body: responseText.substr(0, 10),
    status: response.status,
    headers: JSON.stringify(response.headers),
    contentType: response.headers.get("content-type"),
  });

  const responseBody: A | null =  (() => {
    if (responseText.length === 0) {
      log.error("response text was zero length");

      return null;
    }

    const contentType = response.headers.get("content-type");
    if (contentType === null) {
      log.error("header content-type was null");

      return null;
    }

    if (!/^application\/json/.test(contentType)) {
      log.error("content-type did not match application json regex", {
        contentType,
      });

      return null;
    }

    return JSON.parse(responseText);
  })();

  return {
    body: responseBody,
    response,
    status: response.status,
  };
}
