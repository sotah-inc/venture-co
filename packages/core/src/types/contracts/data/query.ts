import { IErrorResponse, IValidationErrorResponse } from "../index";

export interface IQueryItemWithId {
  id: number;
}

export interface IQueryItem<T extends IQueryItemWithId> {
  item: T | null;
  target: string;
  rank: number;
}

export interface IQueryResponseData<T extends IQueryItemWithId> {
  items: Array<IQueryItem<T>>;
}

export type QueryResponse<T extends IQueryItemWithId> =
  | IQueryResponseData<T>
  | IErrorResponse
  | IValidationErrorResponse
  | null;

export interface IQueryRequest {
  query?: string;
  locale: string;
}
