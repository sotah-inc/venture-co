import {
  ICreatePostRequest,
  ICreatePreferencesRequest,
  ICreateUserRequest,
  ICreateWorkOrderRequest,
  IGetAuctionsRequest,
  IQueryRequest,
  ISaveLastPathRequest,
  Locale,
  OrderDirection,
  OrderKind,
  SortDirection,
  SortKind,
  SortPerPage,
} from "@sotah-inc/core";
import { IFindByOptions, PostRepository, RegionsMessenger } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import * as yup from "yup";

import { ValidateResult } from "../index";

/*
  individual rules
 */

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

export const PageRule = yup
  .number()
  .integer("page must be an integer")
  .required("page is required");

export const CountRule = yup
  .number()
  .integer("count must be an integer")
  .required("count is required");

export const SortDirectionRule = yup
  .number()
  .integer("sort-direction must be an integer")
  .required("sort-direction is required")
  .oneOf(Object.values(SortDirection).map(Number));

export const SortKindRule = yup
  .number()
  .integer("sort-kind must be an integer")
  .required("sort-kind is required")
  .oneOf(Object.values(SortKind).map(Number));

export const ItemIdRule = yup.number().required();

export const ItemIdsRule = yup.array(ItemIdRule);

export const PetIdRule = yup.number().required().integer("pet-id must be an integer");

export const PetIdsRule = yup.array(PetIdRule);

export const EmailRule = yup
  .string()
  .email("email must be a valid email")
  .required("email is required");

export const PasswordRule = yup
  .string()
  .min(6, "password must be at least 6 characters")
  .required("password is required");

export const PostBodyRule = yup.string().required("body is required");

export const PostSummaryRule = yup.string().required("summary is required");

export const PostTitleRule = yup.string().required("post title is required");

/*
  request contract rules
 */

export const PreferenceRules = yup
  .object<ICreatePreferencesRequest>({
    current_realm: yup.string().required(),
    current_region: yup.string().required(),
  })
  .required()
  .noUnknown();

export const SaveLastPathRules = yup
  .object<ISaveLastPathRequest>({
    lastClientAsPath: yup.string().required("last-client-as-path is required"),
    lastClientPathname: yup.string().required("last-client-pathname is required"),
  })
  .required()
  .noUnknown();

export const PriceListEntryRules = yup
  .object({
    id: yup.number(),
    item_id: ItemIdRule,
    quantity_modifier: yup.number().required(),
  })
  .required()
  .noUnknown();

export const PricelistRules = yup
  .object({
    name: yup.string().required(),
    slug: SlugRule,
  })
  .required()
  .noUnknown();

export const PricelistRequestBodyRules = yup
  .object({
    entries: yup.array(PriceListEntryRules).required(),
    pricelist: PricelistRules.required(),
  })
  .required()
  .noUnknown();

export const ProfessionPricelistRequestBodyRules = yup
  .object({
    entries: yup.array(PriceListEntryRules).required(),
    expansion_name: yup.string().required(),
    pricelist: PricelistRules.required(),
    profession_id: yup.number().required(),
  })
  .required()
  .noUnknown();

export const UserRequestBodyRules = yup
  .object<ICreateUserRequest>({
    email: EmailRule,
    password: PasswordRule,
  })
  .required()
  .noUnknown();

export const PostRequestBodyRules = yup
  .object<ICreatePostRequest>({
    body: PostBodyRule,
    slug: SlugRule,
    summary: PostSummaryRule,
    title: PostTitleRule,
  })
  .required()
  .noUnknown();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function FullPostRequestBodyRules(repo: PostRepository, exceptSlug?: string) {
  return yup
    .object<Pick<ICreatePostRequest, "slug">>({
      slug: SlugRule.test("is-unique", "post must be unique", v => {
        if (!v) {
          return false;
        }

        return repo.hasNoSlug(v, exceptSlug);
      }),
    })
    .concat(PostRequestBodyRules);
}

export const AuctionsQueryParamsRules = yup
  .object<IGetAuctionsRequest>({
    count: CountRule,
    itemFilters: ItemIdsRule,
    locale: LocaleRule,
    page: PageRule,
    petFilters: PetIdsRule,
    sortDirection: SortDirectionRule,
    sortKind: SortKindRule,
  })
  .required()
  .noUnknown();

export const QueryParamRules = yup
  .object<IQueryRequest>({
    locale: LocaleRule,
    query: yup.string(),
  })
  .required()
  .noUnknown();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const QueryWorkOrdersQueryRules = yup
  .object<IFindByOptions>()
  .shape({
    locale: LocaleRule,
    orderBy: OrderKindRule,
    orderDirection: OrderDirectionRule,
    page: PageRule,
    perPage: PerPageRule,
  })
  .noUnknown();

export const CreateWorkOrderRequestRules = yup
  .object<ICreateWorkOrderRequest>({
    itemId: ItemIdRule,
    price: yup.number().integer().required().positive(),
    quantity: yup.number().integer().positive().required(),
  })
  .required()
  .noUnknown();

export async function validate<T>(
  schema: yup.Schema<T>,
  payload: unknown,
): Promise<ValidateResult<T>> {
  try {
    return {
      body: await schema.validate(payload),
      errors: null,
    };
  } catch (err) {
    if (!(err instanceof yup.ValidationError)) {
      throw new Error("error was not yup error");
    }

    return {
      errors: [{ path: [err.path], message: err.message }],
    };
  }
}
