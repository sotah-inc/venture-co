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

export interface IPriceHistories<T extends IPrices> {
  [unixTimestamp: number]: T | undefined;
}

export interface IPriceLimits {
  upper: number;
  lower: number;
}

export interface IBollingerBands {
  upper: number[];
  mid: number[];
  lower: number[];
}
