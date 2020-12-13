import { ItemId } from "../../item";
import {
  IItemPriceLimits,
  IItemPricelistHistoryMap,
  IPriceLimits,
  IPricesFlagged,
} from "../../pricelist";
import { IShortItem } from "../../short-item";
import { IValidationErrorResponse } from "../index";

export interface IGetItemPriceHistoriesRequest {
  item_ids: ItemId[];
  lower_bounds?: number;
  upper_bounds?: number;
}

export interface IGetItemPriceHistoriesResponseData {
  history: IItemPricelistHistoryMap<IPricesFlagged>;
  items: IShortItem[];
  itemPriceLimits: IItemPriceLimits;
  overallPriceLimits: IPriceLimits;
}

export type GetItemPriceHistoriesResponse =
  | IGetItemPriceHistoriesResponseData
  | IValidationErrorResponse
  | null;
