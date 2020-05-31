export interface IPrices {
  min_buyout_per: number;
  max_buyout_per: number;
  average_buyout_per: number;
  median_buyout_per: number;
  volume: number;
}

export interface IPricesFlagged extends IPrices {
  is_blank: boolean;
}

export interface IPriceListMap {
  [itemId: number]: IPrices | undefined;
}

export interface IItemPricelistHistoryMap<T extends IPrices> {
  [itemId: number]: IPricelistHistoryMap<T> | undefined;
}

export interface IPricelistHistoryMap<T extends IPrices> {
  [unixTimestamp: number]: T | undefined;
}

export interface IPriceLimits {
  upper: number;
  lower: number;
}

export interface IItemPriceLimits {
  [itemId: number]: IPriceLimits | undefined;
}

export interface IItemMarketPrices {
  [itemId: number]: number | undefined;
}

export interface IBollingerBands {
  upper: number[];
  mid: number[];
  lower: number[];
}
