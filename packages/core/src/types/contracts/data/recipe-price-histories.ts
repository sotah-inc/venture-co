import { IPriceLimits } from "../../prices";
import { IRecipePriceHistories } from "../../recipe-prices";
import { IValidationErrorResponse } from "../index";

export interface IGetRecipePriceHistoriesResponseData {
  history: IRecipePriceHistories;
  overallPriceLimits: IPriceLimits;
}

export type GetRecipePriceHistoriesResponse =
  | IGetRecipePriceHistoriesResponseData
  | IValidationErrorResponse
  | null;
