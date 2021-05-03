import { ItemRecipeKind } from "@sotah-inc/core";
import * as z  from "zod";

export const ItemsRecipesQuery = z.object({
  locale: z.string(),
  itemIds: z.array(z.string()),
  kind: z.nativeEnum(ItemRecipeKind),
});

export const ItemsVendorPricesQuery = z.object({
  itemIds: z.array(z.string()),
});
