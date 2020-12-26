import { ItemId } from "../../item";
import { IPriceLimits } from "../../prices";
import { IRecipePriceHistories } from "../../recipe-prices";
import { IValidationErrorResponse } from "../index";

export interface IGetRecipePriceHistoriesResponseData {
  history: IRecipePriceHistories;
  overallPriceLimits: IPriceLimits;
  recipeItemIds: { [key: number]: ItemId[] };
}

export type GetRecipePriceHistoriesResponse =
  | IGetRecipePriceHistoriesResponseData
  | IValidationErrorResponse
  | null;
