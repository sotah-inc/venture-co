import { ItemId } from "../../item";
import { IItemPriceHistories } from "../../item-prices";
import { IPricesFlagged } from "../../prices";
import { IRecipePriceHistories } from "../../recipe-prices";
import { IValidationErrorResponse } from "../index";

export interface IGetRecipePriceHistoriesResponseData {
  recipeData: {
    history: IRecipePriceHistories;
    recipeItemIds: { [key: number]: ItemId[] };
  };
  itemData: {
    history: IItemPriceHistories<IPricesFlagged>;
  };
}

export type GetRecipePriceHistoriesResponse =
  | IGetRecipePriceHistoriesResponseData
  | IValidationErrorResponse
  | null;
