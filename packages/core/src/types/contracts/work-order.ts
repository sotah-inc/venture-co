import { IShortItem } from "../short-item";
import { IWorkOrderJson } from "../work-order";

import { IValidationErrorResponse } from "./index";

export interface IQueryWorkOrdersParams {
  orderBy: string;
  orderDirection: string;
  page: number;
  perPage: number;
}

export interface IQueryWorkOrdersResponseData {
  orders: IWorkOrderJson[];
  totalResults: number;
  items: IShortItem[];
}

export type QueryWorkOrdersResponse =
  | IQueryWorkOrdersResponseData
  | IValidationErrorResponse
  | null;

export interface ICreateWorkOrderRequest {
  itemId: number;
  quantity: number;
  price: number;
}

export interface ICreateWorkOrderResponseData {
  order: IWorkOrderJson;
}

export type CreateWorkOrderResponse = ICreateWorkOrderResponseData | IValidationErrorResponse;

export interface IPrefillWorkOrderItemResponseData {
  currentPrice: number | null;
}

export type PrefillWorkOrderItemResponse =
  | IPrefillWorkOrderItemResponseData
  | IValidationErrorResponse
  | null;
