import {
  GameVersion,
  ICreateWorkOrderRequest,
  ICreateWorkOrderResponse,
  IPrefillWorkOrderItemResponse,
  IQueryWorkOrdersParams,
  IQueryWorkOrdersResponse,
  ItemId,
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
  token: string,
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
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "POST",
    url: baseUrl,
  });
  switch (status) {
    case HTTPStatus.CREATED:
      return { errors: null, data: body as ICreateWorkOrderResponse };
    case HTTPStatus.BAD_REQUEST:
      return { errors: body as IValidationErrorResponse, data: null };
    case HTTPStatus.INTERNAL_SERVER_ERROR:
      return { errors: { error: "There was a server error." }, data: null };
    default:
      return { errors: { error: "There was an unknown error." }, data: null };
  }
}

export interface IPrefillWorkOrderItemOptions extends IWorkOrderParams {
  itemId: ItemId;
}

export interface IPrefillWorkOrderItemResult {
  data: IPrefillWorkOrderItemResponse | null;
  errors: IValidationErrorResponse | null;
}

export async function prefillWorkOrderItem(
  opts: IPrefillWorkOrderItemOptions,
): Promise<IPrefillWorkOrderItemResult> {
  const baseUrl = [
    getApiEndpoint(),
    "work-orders",
    opts.gameVersion,
    opts.regionName,
    opts.realmSlug,
    "prefill-item",
  ].join("/");

  const { body, status } = await gather<
    null,
    IPrefillWorkOrderItemResponse | IValidationErrorResponse
  >({
    headers: new Headers({
      "content-type": "application/json",
    }),
    method: "GET",
    url: `${baseUrl}?${queryString.stringify({ itemId: opts.itemId })}`,
  });
  switch (status) {
    case HTTPStatus.OK:
      return { errors: null, data: body as IPrefillWorkOrderItemResponse };
    case HTTPStatus.BAD_REQUEST:
      return { errors: body as IValidationErrorResponse, data: null };
    case HTTPStatus.INTERNAL_SERVER_ERROR:
      return { errors: { error: "There was a server error." }, data: null };
    default:
      return { errors: { error: "There was an unknown error." }, data: null };
  }
}
