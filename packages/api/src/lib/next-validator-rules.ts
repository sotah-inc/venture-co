import * as z  from "zod";

export const ItemsRecipesQuery = z.object({
  locale: z.string(),
  itemIds: z.array(z.string()),
});
