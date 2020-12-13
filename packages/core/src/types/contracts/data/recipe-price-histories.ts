import { IRecipePriceHistories } from "../../recipe-prices";
import { IValidationErrorResponse } from "../index";

export interface IGetRecipePricesHistoryResponseData {
  history: IRecipePriceHistories;
}

export type GetRecipePricesHistoryResponse =
  | IGetRecipePricesHistoryResponseData
  | IValidationErrorResponse
  | null;
