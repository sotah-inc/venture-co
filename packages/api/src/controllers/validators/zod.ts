import { ItemRecipeKind, Locale } from "@sotah-inc/core";
import { z } from "zod";

import { IValidateResultError, ValidateResult } from "../index";

export const LocaleRule = z.nativeEnum(Locale);

export const ItemsRecipesQuery = z.object({
  locale: z.string(),
  itemIds: z.array(z.string()),
  kind: z.nativeEnum(ItemRecipeKind),
});

export const ItemsVendorPricesQuery = z.object({
  itemIds: z.array(z.string()),
});

export function validate<T>(schema: z.Schema<T>, data: unknown): ValidateResult<T> {
  try {
    return {
      body: schema.parse(data),
      errors: null,
    };
  } catch (err) {
    if (!(err instanceof z.ZodError)) {
      throw new Error("error was not zod-error");
    }

    return {
      errors: err.issues.map<IValidateResultError>(v => {
        return {
          message: v.message,
          path: v.path,
        };
      }),
    };
  }
}
