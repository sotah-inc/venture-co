import { ItemId } from "../../item";
import { IItemPriceHistories } from "../../item-prices";
import { IPriceLimits, IPricesFlagged } from "../../prices";
import { IRecipePriceHistories } from "../../recipe-prices";
import { IValidationErrorResponse } from "../index";

export interface IGetRecipePriceHistoriesResponseData {
  recipeData: {
    history: IRecipePriceHistories;
    overallPriceLimits: IPriceLimits;
    recipeItemIds: { [key: number]: ItemId[] };
  };
  itemData: {
    history: IItemPriceHistories<IPricesFlagged>;
    aggregatePriceLimits: IPriceLimits;
  };
}

export type GetRecipePriceHistoriesResponse =
  | IGetRecipePriceHistoriesResponseData
  | IValidationErrorResponse
  | null;
