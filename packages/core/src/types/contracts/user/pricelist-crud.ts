import { IPricelistEntryJson, IPricelistJson } from "../../entities";
import { IItemsMap } from "../../item";
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
  items: IItemsMap;
}

export type GetPricelistsResponse = IGetPricelistsResponseData;

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
