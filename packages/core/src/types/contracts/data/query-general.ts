import { IShortItem } from "../../short-item";
import { IShortPet } from "../../short-pet";
import { IErrorResponse, IValidationErrorResponse } from "../index";
import { IQueryRequest } from "./query";

export type QueryGeneralRequest = IQueryRequest;

export interface IQueryGeneralItemItem {
  item: IShortItem | null;
  pet: IShortPet | null;
}

export interface IQueryGeneralItem {
  item: IQueryGeneralItemItem;
  target: string;
  rank: number;
}

export interface IQueryGeneralResponseData {
  items: IQueryGeneralItem[];
}

export type QueryGeneralResponse =
  | IQueryGeneralResponseData
  | IErrorResponse
  | IValidationErrorResponse
  | null;
