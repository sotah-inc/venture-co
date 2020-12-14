import { GetTokenHistoryResponse, ITokenHistory, RegionName } from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { getApiEndpoint } from "./config";
import { gather } from "./gather";

export interface IGetTokenHistoryResult {
  history: ITokenHistory | null;
  error: string | null;
}

export const getTokenHistory = async (regionName: RegionName): Promise<IGetTokenHistoryResult> => {
  const { body, status } = await gather<null, GetTokenHistoryResponse>({
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

  return { history: body!.history, error: null };
};
