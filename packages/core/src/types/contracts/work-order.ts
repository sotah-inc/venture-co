import { IWorkOrderJson } from "../work-order";

export interface IQueryWorkOrdersParams {
  orderBy: string;
  orderDirection: string;
  page: number;
  perPage: number;
  gameVersion: string;
}

export interface IQueryWorkOrdersResponse {
  orders: IWorkOrderJson[];
}
