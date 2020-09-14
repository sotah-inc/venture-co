import { IPricelistEntryJson, IPricelistJson } from "../../entities";
import { IShortItem } from "../../short-item";
import { IValidationErrorResponse } from "../index";

export interface ICreatePricelistRequest {
  pricelist: {
    name: string;
    slug: string;
  };
  entries: Array<{
    id?: number;
    item_id: number;
    quantity_modifier: number;
  }>;
}

export interface ICreatePricelistResponseData {
  pricelist: IPricelistJson;
  entries: IPricelistEntryJson[];
}

export type CreatePricelistResponse = ICreatePricelistResponseData | IValidationErrorResponse;

export interface IGetPricelistsResponseData {
  pricelists: IPricelistJson[];
  items: IShortItem[];
}

export type GetPricelistsResponse = IGetPricelistsResponseData | IValidationErrorResponse;

export interface IGetUserPricelistResponseData {
  pricelist: IPricelistJson;
}

export type GetUserPricelistResponse = IGetUserPricelistResponseData | null;

export type UpdatePricelistRequest = ICreatePricelistRequest;

export type UpdatePricelistResponse =
  | ICreatePricelistResponseData
  | IValidationErrorResponse
  | null;

export type DeletePricelistResponse = null;
