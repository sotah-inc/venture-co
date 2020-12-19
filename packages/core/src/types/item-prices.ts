import { IPriceHistories, IPriceLimits, IPrices } from "./prices";

export interface IItemPrices {
  [itemId: number]: IPrices | undefined;
}

export interface IItemPriceHistories<T extends IPrices> {
  [itemId: number]: IPriceHistories<T> | undefined;
}
export interface IItemPriceLimits {
  [itemId: number]: IPriceLimits | undefined;
}
