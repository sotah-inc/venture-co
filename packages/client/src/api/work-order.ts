import {
  GameVersion,
  IQueryWorkOrdersParams,
  IQueryWorkOrdersResponse,
  IValidationErrorResponse,
  RealmSlug,
  RegionName,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";
import queryString from "query-string";

import { gather, getApiEndpoint } from "./index";

export interface IQueryWorkOrdersResult {
  data: IQueryWorkOrdersResponse | null;
  errors: IValidationErrorResponse | null;
}

export interface IQueryWorkOrdersOptions extends IQueryWorkOrdersParams {
  gameVersion: GameVersion;
  regionName: RegionName;
  realmSlug: RealmSlug;
}

export async function queryWorkOrders(
  opts: IQueryWorkOrdersOptions,
): Promise<IQueryWorkOrdersResult> {
  const baseUrl = [
    getApiEndpoint(),
    "work-orders",
    opts.gameVersion,
    opts.regionName,
    opts.realmSlug,
  ].join("/");
  const queryParams: IQueryWorkOrdersParams = {
    orderBy: opts.orderBy,
    orderDirection: opts.orderDirection,
    page: opts.page,
    perPage: opts.perPage,
  };

  const { body, status } = await gather<void, IQueryWorkOrdersResponse | IValidationErrorResponse>({
    method: "GET",
    url: `${baseUrl}?${queryString.stringify(queryParams)}`,
  });
  switch (status) {
    case HTTPStatus.OK:
      return { errors: null, data: body as IQueryWorkOrdersResponse };
    case HTTPStatus.BAD_REQUEST:
      return { errors: body as IValidationErrorResponse, data: null };
    case HTTPStatus.INTERNAL_SERVER_ERROR:
      return { errors: { email: "There was a server error." }, data: null };
    default:
      return { errors: { email: "There was an unknown error." }, data: null };
  }
}
