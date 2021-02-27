import { ItemId } from "@sotah-inc/core";

export enum TabKind {
  craftingCost = "craftingCost",
  reagentPrices = "reagentPrices",
}

export const TotalReagentCostDataKey = "total_reagent_cost";

export function resolveItemDataKey(id: ItemId): string {
  return `${id}_market_per`;
}
