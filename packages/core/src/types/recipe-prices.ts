export interface IRecipePrices {
  min_buyout_per: number;
  max_buyout_per: number;
  average_buyout_per: number;
  median_buyout_per: number;
}

export interface IRecipePriceHistory {
  [unixTimestamp: number]: IRecipePrices;
}

export interface IRecipePriceHistories {
  [recipeId: number]: IRecipePriceHistory;
}
