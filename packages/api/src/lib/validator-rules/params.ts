import { Locale, OrderDirection, OrderKind, SortPerPage } from "@sotah-inc/core";
import { code, RegionsMessenger } from "@sotah-inc/server";
import * as yup from "yup";

// eslint-disable-next-line @typescript-eslint/ban-types
export function GameVersionRule(mess: RegionsMessenger): yup.StringSchema<string, object> {
  return yup
    .string()
    .required()
    .test(
      "exists",
      "game-version must be valid",
      async (v): Promise<boolean> => {
        if (!v) {
          return false;
        }

        const result = await mess.validateGameVersion({ game_version: v });
        if (result.code !== code.ok) {
          throw new Error("code was not ok");
        }

        const resultData = await result.decode();
        if (resultData === null) {
          throw new Error("result data was null");
        }

        return resultData.is_valid;
      },
    );
}

export const SlugRule = yup
  .string()
  .min(4, "post slug must be 4 characters")
  .matches(/^[a-z0-9_-]+$/, "post slug must be a-z, 0-9, or underscore")
  .required("post slug is required");

export const LocaleRule = yup.string().required().oneOf(Object.values(Locale));

export const OrderKindRule = yup.string().required().oneOf(Object.values(OrderKind));

export const OrderDirectionRule = yup.string().required().oneOf(Object.values(OrderDirection));

export const PerPageRule = yup
  .number()
  .required()
  .positive()
  .oneOf(
    Object.values(SortPerPage)
      .filter(v => !isNaN(Number(v)))
      .map(Number),
  );
