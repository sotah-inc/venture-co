import { IErrorResponse, IValidationErrorResponse } from "../index";

export interface IQueryItem<T> {
  item: T | null;
  target: string;
  rank: number;
}

export interface IQueryResponseData<T> {
  items: Array<IQueryItem<T>>;
}

export type QueryResponse<T> =
  | IQueryResponseData<T>
  | IErrorResponse
  | IValidationErrorResponse
  | null;

export interface IQueryRequest {
  query?: string;
  locale: string;
}
