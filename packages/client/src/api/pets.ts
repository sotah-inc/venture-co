import { IQueryRequest, IQueryResponseData, IShortPet, QueryResponse } from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { getApiEndpoint } from "./config";
import { gatherWithQuery } from "./gather";

export async function getPets(req: IQueryRequest): Promise<IQueryResponseData<IShortPet> | null> {
  const { body, status } = await gatherWithQuery<IQueryRequest, QueryResponse<IShortPet>>({
    method: "GET",
    query: req,
    url: `${getApiEndpoint()}/pets`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IQueryResponseData<IShortPet>;
}
