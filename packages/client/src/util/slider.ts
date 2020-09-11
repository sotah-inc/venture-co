import { IPrefillWorkOrderItemResponseData, IShortItem } from "@sotah-inc/core";

import { IFetchData } from "../types/global";
import { FetchLevel } from "../types/main";

export interface ISliderData {
  min: number;
  max: number;
  range: number;
  step: number;
}

export function translateQuantityToSliderData(item?: IShortItem | null): ISliderData | null {
  if (typeof item === "undefined" || item === null) {
    return null;
  }

  switch (item.max_count) {
    case 200:
      return ((): ISliderData => {
        const step = 20;
        const max = item.max_count;
        const min = step;

        return {
          max,
          min,
          range: max - min,
          step,
        };
      })();
    case 20:
      return ((): ISliderData => {
        const step = 5;
        const max = item.max_count;
        const min = step;

        return {
          max,
          min,
          range: max - min,
          step,
        };
      })();
    case 1:
      return ((): ISliderData => {
        const step = 1;
        const max = 10;
        const min = step;

        return {
          max,
          min,
          range: max - min,
          step,
        };
      })();
    default:
      return ((): ISliderData => {
        const step = 1;
        const max = item.max_count;
        const min = step;

        return {
          max,
          min,
          range: max - min,
          step,
        };
      })();
  }
}

export function translatePriceToSliderData(
  prefillWorkOrderItem: IFetchData<IPrefillWorkOrderItemResponseData>,
): ISliderData | null {
  if (
    prefillWorkOrderItem.level !== FetchLevel.success ||
    prefillWorkOrderItem.data.currentPrice === null
  ) {
    return null;
  }

  const min = prefillWorkOrderItem.data.currentPrice / 2;
  const max = prefillWorkOrderItem.data.currentPrice * 2;
  const range = max - min;
  const step = range / 6;

  return { min, max, range, step };
}
