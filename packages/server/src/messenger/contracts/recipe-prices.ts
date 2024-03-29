import {
  IRecipePriceHistories,
  IRegionVersionConnectedRealmTuple,
  RecipeId,
  UnixTimestamp,
} from "@sotah-inc/core";

export interface IGetRecipePricesHistoryRequest {
  tuple: IRegionVersionConnectedRealmTuple;
  recipe_ids: RecipeId[];
  lower_bounds: UnixTimestamp;
  upper_bounds: UnixTimestamp;
}

export interface IGetRecipePricesHistoryResponse {
  history: IRecipePriceHistories;
}
