import {
  GetRegionTokenHistoryResponse,
  GetShortTokenHistoryResponse,
  IRegionTokenHistory,
  IShortTokenHistory,
  RegionName,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { getApiEndpoint } from "./config";
import { gather } from "./gather";

export interface IGetTokenHistoryResult {
  history: IRegionTokenHistory | null;
  error: string | null;
}

export async function getRegionTokenHistory(
  regionName: RegionName,
): Promise<IGetTokenHistoryResult> {
  const { body, status } = await gather<null, GetRegionTokenHistoryResponse>({
    headers: new Headers({ "content-type": "application/json" }),
    method: "GET",
    url: `${getApiEndpoint()}/token-history/${regionName}`,
  });

  switch (status) {
  case HTTPStatus.OK:
    break;
  default:
    return { history: null, error: "Failure" };
  }

  if (body === null) {
    return { history: null, error: "Empty body" };
  }

  return { history: body.history, error: null };
}

export interface IGetShortTokenHistoryResult {
  history: IShortTokenHistory | null;
  error: string | null;
}

export async function getShortTokenHistory(): Promise<IGetShortTokenHistoryResult> {
  const { body, status } = await gather<null, GetShortTokenHistoryResponse>({
    headers: new Headers({ "content-type": "application/json" }),
    method: "GET",
    url: `${getApiEndpoint()}/token-history`,
  });

  switch (status) {
  case HTTPStatus.OK:
    break;
  default:
    return { history: null, error: "Failure" };
  }

  if (body === null) {
    return { history: null, error: "Empty body" };
  }

  return { history: body.history, error: null };
}
