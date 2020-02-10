import {
  GameVersion,
  IQueryWorkOrdersParams,
  IQueryWorkOrdersResponse,
  IValidationErrorResponse,
  RealmSlug,
  RegionName,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

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
  const { body, status } = await gather<void, IQueryWorkOrdersResponse | IValidationErrorResponse>({
    method: "GET",
    url: [
      getApiEndpoint(),
      `game-version/${opts.gameVersion}`,
      `region-name/${opts.regionName}`,
      `realm-slug/${opts.realmSlug}`,
      "work-orders",
    ].join("/"),
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
