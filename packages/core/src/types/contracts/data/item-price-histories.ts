import { ItemId } from "../../item";
import { IItemPriceHistories, IItemPriceLimits } from "../../item-prices";
import { IPriceLimits, IPricesFlagged } from "../../prices";
import { IShortItem } from "../../short-item";
import { IValidationErrorResponse } from "../index";

export interface IGetItemPriceHistoriesRequest {
  item_ids: ItemId[];
  lower_bounds?: number;
  upper_bounds?: number;
}

export interface IGetItemPriceHistoriesResponseData {
  history: IItemPriceHistories<IPricesFlagged>;
  items: IShortItem[];
  itemPriceLimits: IItemPriceLimits;
  overallPriceLimits: IPriceLimits;
}

export type GetItemPriceHistoriesResponse =
  | IGetItemPriceHistoriesResponseData
  | IValidationErrorResponse
  | null;
