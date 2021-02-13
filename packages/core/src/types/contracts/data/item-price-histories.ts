import { ItemId } from "../../item";
import { IItemPriceHistories } from "../../item-prices";
import { IPricesFlagged } from "../../prices";
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
}

export type GetItemPriceHistoriesResponse =
  | IGetItemPriceHistoriesResponseData
  | IValidationErrorResponse
  | null;
