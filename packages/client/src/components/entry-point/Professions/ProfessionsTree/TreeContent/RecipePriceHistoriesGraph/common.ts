import { IShortItem, ItemId } from "@sotah-inc/core";

export enum TabKind {
  craftingCost = "craftingCost",
  reagentPrices = "reagentPrices",
}

export const TotalReagentCostDataKey = "total_reagent_cost";

export function resolveItemDataKey(id: ItemId): string {
  return `${id}_buyout_per`;
}

export interface ICraftingCostLinesOptions {
  recipeItemIds: ItemId[];
  highlightedDataKey: string | null;
  recipeItemsSelected: Set<ItemId>;
  totalReagentCostSelected: boolean;

  onDataKeyHighlight: (dataKey: string | null) => void;
}

export interface ICraftingCostLegendOptions {
  recipeItems: IShortItem[];
  highlightedDataKey: string | null;
  recipeItemsSelected: Set<ItemId>;
  totalReagentCostSelected: boolean;
  craftedRecipeItemIds: ItemId[];

  onDataKeyHighlight: (dataKey: string | null) => void;
  onTotalReagentCostSelect: () => void;
  onRecipeItemSelect: (id: ItemId) => void;
  onReset: () => void;
}
