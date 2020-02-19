import { IWorkOrderJson } from "../work-order";

export interface IQueryWorkOrdersParams {
  orderBy: string;
  orderDirection: string;
  page: number;
  perPage: number;
}

export interface IQueryWorkOrdersResponse {
  orders: IWorkOrderJson[];
  totalResults: number;
}

export interface ICreateWorkOrderRequest {
  itemId: number;
  quantity: number;
  price: number;
}

export interface ICreateWorkOrderResponse {
  order: IWorkOrderJson;
}
