import { IRecipePriceHistories } from "../../recipe-prices";
import { IValidationErrorResponse } from "../index";

export interface IGetRecipePriceHistoriesResponseData {
  history: IRecipePriceHistories;
}

export type GetRecipePriceHistoriesResponse =
  | IGetRecipePriceHistoriesResponseData
  | IValidationErrorResponse
  | null;
