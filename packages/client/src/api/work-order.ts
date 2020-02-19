import {
  GameVersion,
  ICreateWorkOrderRequest,
  ICreateWorkOrderResponse,
  IQueryWorkOrdersParams,
  IQueryWorkOrdersResponse,
  IValidationErrorResponse,
  RealmSlug,
  RegionName,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";
import queryString from "query-string";

import { gather, getApiEndpoint } from "./index";

interface IWorkOrderParams {
  gameVersion: GameVersion;
  regionName: RegionName;
  realmSlug: RealmSlug;
}

export interface IQueryWorkOrdersResult {
  data: IQueryWorkOrdersResponse | null;
  errors: IValidationErrorResponse | null;
}

export type QueryWorkOrdersOptions = IQueryWorkOrdersParams & IWorkOrderParams;

export async function queryWorkOrders(
  opts: QueryWorkOrdersOptions,
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
      return { errors: { error: "There was a server error." }, data: null };
    default:
      return { errors: { error: "There was an unknown error." }, data: null };
  }
}

export interface ICreateWorkOrderOptions extends IWorkOrderParams {
  req: ICreateWorkOrderRequest;
}

export interface ICreateWorkOrderResult {
  data: ICreateWorkOrderResponse | null;
  errors: IValidationErrorResponse | null;
}

export async function createWorkOrder(
  opts: ICreateWorkOrderOptions,
): Promise<ICreateWorkOrderResult> {
  const baseUrl = [
    getApiEndpoint(),
    "work-orders",
    opts.gameVersion,
    opts.regionName,
    opts.realmSlug,
  ].join("/");

  const { body, status } = await gather<
    ICreateWorkOrderRequest,
    ICreateWorkOrderResponse | IValidationErrorResponse
  >({
    body: opts.req,
    method: "POST",
    url: baseUrl,
  });
  switch (status) {
    case HTTPStatus.OK:
      return { errors: null, data: body as ICreateWorkOrderResponse };
    case HTTPStatus.BAD_REQUEST:
      return { errors: body as IValidationErrorResponse, data: null };
    case HTTPStatus.INTERNAL_SERVER_ERROR:
      return { errors: { error: "There was a server error." }, data: null };
    default:
      return { errors: { error: "There was an unknown error." }, data: null };
  }
}
