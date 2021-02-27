export interface IRecipeItemItemPrices {
  min_buyout_per: number;
  max_buyout_per: number;
  average_buyout_per: number;
  median_buyout_per: number;
  market_buyout_per: number;
}

export interface IRecipeItemPrices {
  id: number;
  prices: IRecipeItemItemPrices;
}

export interface IRecipePrices {
  crafted_item_prices: IRecipeItemPrices;
  alliance_crafted_item_prices: IRecipeItemPrices;
  horde_crafted_item_prices: IRecipeItemPrices;
  total_reagent_prices: IRecipeItemItemPrices;
}

export interface IRecipePriceHistory {
  [unixTimestamp: number]: IRecipePrices;
}

export interface IRecipePriceHistories {
  [recipeId: number]: IRecipePriceHistory;
}
