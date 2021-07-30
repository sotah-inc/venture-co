import { ItemRecipeKind, Locale } from "@sotah-inc/core";
import { RegionsMessenger } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
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

export const PrefillWorkOrderItemQuery = z.object({
  itemId: z.number().min(0),
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function GameVersionRule(mess: RegionsMessenger) {
  return z
    .string()
    .nonempty("game-version cannot be empty")
    .superRefine(async (val, ctx) => {
      const msg = await mess.validateGameVersion({ game_version: val });
      if (msg.code !== code.ok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "message code was not ok",
        });

        return;
      }

      const result = await msg.decode();
      if (result === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "message data was not parseable",
        });

        return;
      }

      if (!result.is_valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "game-version must be valid",
        });

        return;
      }
    });
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function RegionNameRule(mess: RegionsMessenger) {
  return z
    .string()
    .nonempty("region-name cannot be empty")
    .superRefine(async (val, ctx) => {
      const msg = await mess.validateRegion({ region_name: val });
      if (msg.code !== code.ok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "message code was not ok",
        });

        return;
      }

      const result = await msg.decode();
      if (result === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "message data was not parseable",
        });

        return;
      }

      if (!result.is_valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "region-name must be valid",
        });

        return;
      }
    });
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function RealmSlugRules(mess: RegionsMessenger) {
  return z
    .string()
    .nonempty("connected-realm-id cannot be empty")
    .superRefine(async (val, ctx) => {
      const msg = await mess.validateRegionConnectedRealm({ region_name: val });
      if (msg.code !== code.ok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "message code was not ok",
        });

        return;
      }

      const result = await msg.decode();
      if (result === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "message data was not parseable",
        });

        return;
      }

      if (!result.is_valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "region-name must be valid",
        });

        return;
      }
    });
}

export function validate<T>(schema: z.Schema<T>, data: unknown): ValidateResult<T> {
  try {
    const result = schema.parse(data);

    return {
      body: result,
      errors: null,
    };
  } catch (err) {
    if (!(err instanceof z.ZodError)) {
      throw new Error("error was not zod-error");
    }

    return {
      body: null,
      errors: err.issues.map<IValidateResultError>(v => {
        return {
          message: v.message,
          path: v.path,
        };
      }),
    };
  }
}
